const players = require('./database/controllers/players');
const decks = require('./database/controllers/decks');
const deck_card = require('./database/controllers/deck_card');

const startingCards = 3; 
const maxBoardSize = 5; 

var levelup = require('levelup')
var leveldown = require('leveldown')
var async = require('async');

var db = levelup(leveldown('./ay-game-db'))

var lastId = 0;

var connections = {};

var GameStatus = Object.freeze({'swaping':1, "playing":2, "ending":3})

function initGame(player1, player2) {
	connections[player1.id] = player1.connection;
	connections[player2.id] = player2.connection;

	Promise.all([
		players.getById(player1.id),
		players.getById(player2.id),
		deck_card.getByDeck(player1.deckId),
		deck_card.getByDeck(player2.deckId)
	])
	.then((data) => {
		let gameData = {
          player1: {
              id: player1.id,
              tag: data[0].gamerTag,
              job: data[2].job,
              hand: drawCards(data[2].cards,startingCards),
              manapool: 0,
              mana: 0,
              deck: data[2].cards,
              graveward: [],
              deckid: 1,
              board: [],
              weapon: {},
              HP: 30,
              powerActions: 1
          },
          player2: {
              id: player2.id,
              tag: data[1].gamerTag,
              job: data[2].job,
              hand: drawCards(data[3].cards,startingCards),
              manapool: 0,
              mana: 0,
              deck: data[3].cards,
              graveward: [],
              deckid: 2,
              board: [],
              weapon: {},
              HP: 30,
              powerActions: 1
          },
          playing: pickRandom(['player1', 'player2']),
          status: GameStatus.swaping
		};
		lastId++;
		return db.put(lastId, JSON.stringify(gameData));
	})
	.then(() => {
		return  db.get(lastId);
	})
	.then((res) => {
		let gameData = JSON.parse(res.toString());
		sendMessage(connections[player1.id], 'init-game', {
			id: lastId,
			local: {
				tag: gameData.player1.tag,
				hand: gameData.player1.hand
			},
			adversary: {
				tag : gameData.player2.tag
			}
		});
		sendMessage(connections[player2.id], 'init-game', {
			id: lastId,
			local: {
				tag: gameData.player2.tag,
				hand: gameData.player2.hand
			},
			adversary: {
				tag : gameData.player1.tag
			}
		});
	})
	.catch((err) => {
		console.log(err);
	})
	
}

function swapCards(message, gameData, sendMessage) {
	let player = (gameData.player1.id == message.playerId) ? 'player1' : 'player2';
	if (gameData[player].hasOwnProperty('swapped')) {
		sendMessage(connections[gameData[player].id], 'error', 'Cards already swapped please wait');
		return;
	}
	let swappedCards = [];
	for (let i = 0; i < message.swaps.length; i++) {
		let index = gameData[player].hand.findIndex(x => x.uid == message.swaps[i]);
		swappedCards.push(gameData[player].hand[index]);
		gameData[player].hand.splice(index, 1, drawCards(gameData[player].deck)[0]);
	}
	gameData[player].deck.push(...swappedCards);
	gameData[player].swapped = swappedCards.length;
	sendMessage(connections[gameData[player].id], 'swap-cards', {
		id: message.id,
		local: {
			hand: gameData[player].hand
		}
	});
	// Start game
	if(gameData.player1.hasOwnProperty('swapped') && gameData.player2.hasOwnProperty('swapped')) {
		sendMessage(connections[gameData.player1.id], 'swap-cards-completed', gameData.player2.swapped);
		sendMessage(connections[gameData.player2.id], 'swap-cards-completed', gameData.player1.swapped);
		startGame(message, gameData, sendMessage);
	}
}

function startGame(message, gameData, sendMessage) {
	let playing = gameData.playing;
	let notPlaying = (playing == 'player1') ? 'player2' : 'player1';
	gameData[gameData.playing].hand.push(...drawCards(gameData[gameData.playing].deck, 1));
	gameData[gameData.playing].mana = 1;
	gameData[gameData.playing].manapool = 1;
	sendMessage(connections[gameData[playing].id], 'start-turn', {
		mana: gameData[gameData.playing].mana,
		manapool: gameData[gameData.playing].manapool,
		hand: gameData[gameData.playing].hand,
		deck: gameData[gameData.playing].deck.length
	});
	sendMessage(connections[gameData[notPlaying].id], 'start-turn-adversary', {
		mana: gameData[gameData.playing].mana,
		manapool: gameData[gameData.playing].manapool,
		hand: gameData[gameData.playing].hand.length,
		deck: gameData[gameData.playing].deck.length
	});
}

function endTurn(message, gameData, sendMessage) {
	let notPlaying = (gameData.playing == 'player1') ? 'player1' : 'player2';
	// Do end turn actions !
	performBatchActions(gameData);
	// New turn setup
	gameData.playing = (gameData.playing == 'player1') ? 'player2' : 'player1';
	gameData[gameData.playing].manapool = (gameData[gameData.playing].manapool < 10) ? 
											gameData[gameData.playing].manapool + 1 : 
											gameData[gameData.playing].manapool; 
	gameData[gameData.playing].hand.push(...drawCards(gameData[gameData.playing].deck, 1));
	gameData[gameData.playing].mana = gameData[gameData.playing].manapool;
	for (let i in gameData[gameData.playing].board) {
		gameData[gameData.playing].board[i].actions = 1;
	}
	gameData[gameData.playing].powerActions = 1;
	// Do begin turn actions
	performBatchActions(gameData);

	sendMessage(connections[gameData[gameData.playing].id], 'start-turn',  {
		mana: gameData[gameData.playing].mana,
		manapool: gameData[gameData.playing].manapool,
		hand: gameData[gameData.playing].hand,
		deck: gameData[gameData.playing].deck.length
	});
	sendMessage(connections[gameData[notPlaying].id], 'start-turn-adversary', {
		mana: gameData[gameData.playing].mana,
		manapool: gameData[gameData.playing].manapool,
		hand: gameData[gameData.playing].hand.length-1gth,
		deck: gameData[gameData.playing].deck.length
	});
}

function playCard(message, gameData, sendMessage) {
	console.log("PLAYING CARD")
	let player = (gameData.player1.id == message.playerId) ? 'player1' : 'player2';
	let adversary = (gameData.player1.id == message.playerId) ? 'player2' : 'player1';
	let index;
	let card;

	if (player != gameData.playing) {
		sendMessage(connections[gameData[player].id], 'error', 'Wait your turn to play');
		return;
	}

	index = gameData[player].hand.findIndex(x => x.uid == message.card);
	console.log(index);
	card = gameData[player].hand[index];

	if (!isCardValid(index, gameData, player, sendMessage))
		return;

	switch (card.type) {
		case 'creature' : 
			playCreatureCard(gameData, index, message.index, player, message);
			break;
		case 'weapon' :
			playWeapon(gameData, card, player);
			break;
		case 'spell' :
			playSpellCard(gameData, message, player);
			breakl
	}
	console.log("here");
	gameData[player].mana -= card.specs.cost;
	gameData[player].hand.splice(index,1);

	sendMessage(connections[gameData[player].id], 'update-game', {
		local: gameData[player].board,
		hand: gameData[player].hand,
		mana: gameData[player].mana
	});
	sendMessage(connections[gameData[adversary].id], 'update-game', {
		adversary: gameData[player].board,
		mana: gameData[player].mana,
		hand: gameData[player].hand.length
	});

}

function playWeapon(gameData, weapon, player) {
	gameData[player].weapon = weapon;
	gameData[player].weapon.cDurability = gameData[player].weapon.Durability;

}

function playSpellCard(gameData, message) {
	console.log('playing spell card');
}
 
function playCreatureCard(gameData, card, index, player, message) {
	let adversary = (gameData.playing == 'player1') ? 'player2' : 'player1';
	gameData[player].board.splice(index, 0, gameData[player].hand[card]);
	gameData[player].board[index].cHP = gameData[player].board[index].specs.HP;
	gameData[player].board[index].cAtk = gameData[player].board[index].specs.Atk;
	gameData[player].board[index].actions = 0;

	// check sides bonus
	// check board wide bonus
	if (gameData[player].board[index].specs.abilities.hasOwnProperty('battlecry')) {
		let battlecry = gameData[player].board[index].specs.abilities.battlecry;
		if (battlecry.type == 'charge') {
			gameData[player].board[index].actions += 1;;
		} else if (battlecry.type == 'heal') {
			let target = findTarget(gameData, message.defender);
			if (target == -1) {
				/// invalid target stop !
				console.log("DIDNT FIND IT!");
			}
			else {
				healTarget(card.specs.abilities.battlecry.potency, target);	
			}
		} else if (battlecry.type == 'dmg') {
			let target = findTarget(gameData, message.defender);
			if (target == -1) {
				// invalid
				console.log("DIDNT FIND IT!");
			}
			else {
				dmgTarget(card.specs.abilities.battlecry.potency, target.board[target.index]);
				if (target.hasOwnProperty('HP')) {
					if (target.HP <= 0) {
						// end game now
					}
				}
				else {
					if (target.board[target.index] <= 0) {
						target.board.splice(target.index, 1);
					}
				}
			}
		} else if (battlecry.type == 'draw') {
			gameData[player].hand.push(...drawCards(gameData[player].deck, battlecry.potency));
		}
	}
}

function findTarget(gameData, uid) {
	if (uid == 0)
		return gameData[gameData.playing];
	if (uid == -1)
		return gameData[((gameData.playing == 'player1') ? 'player2' : 'player1')];
	let indexDef = gameData.player1.board.findIndex(x => x.uid == uid);
	if (indexDef != -1) {
		return {
			board: gameData.player1.board,
			index: indexDef
		}
	}
	indexDef = gameData.player2.board.findIndex(x => x.uid == uid);
	if (indexDef != -1) {
		return {
			board: gameData.player2.board,
			index: indexDef
		}
	}
	return indexDef;
}

function dmgTarget(potency, target) {
	if (target.hasOwnProperty('tag')) {
		target.HP -= potency;
	}
	else {
		target.cHP -= potency;
	}
}

function healTarget(potency, target) {
	if (target.hasOwnProperty('tag')) {
		target.HP += (target.HP + potency > 30) ? 30 : potency;
	}
	else {
		target.cHP += (target.cHP + potency > target.specs.HP) ? target.specs.HP : potency;
	}
}

function useHeroPower(message, gameData, sendMessage) {
	// get job 
	// verify params
	// execute action
	console.log(gameData.player1.job);
	switch (gameData[gameData.playing].job.specs.type) {
		case 'dmg':
			// black mage
			// dragoon
			break;
		case 'heal':
			// white mage
			break;
		case 'draw':
			// astrologian
			break;
		case 'summon':
			// summoner
			// machinist
			break;
		case 'buff':
			// scholar
			// bard
			// monk
			// ninja
			// paladin
			break;
		case 'weapon':
			break;
		case 'combined':
			// dark knight
			break;
	}
	
}

function isCardValid(index, gameData, player, sendMessage) {
	console.log("IS CARD VALID?")
	if (index == -1) {
		sendMessage(connections[gameData[player].id], 'error', 'Card not in hand');
		return false;
	}
	console.log("ttttttttttttt")
	console.log(gameData[player].mana);
	console.log(gameData[player].hand[index].spcost);
	console.log("ttttttttttttt")
	if (gameData[player].mana - gameData[player].hand[index].specs.cost < 0) {
		sendMessage(connections[gameData[player].id], 'error', 'Not enough mana');
		return false;
	}
	if ( gameData[player].hand[index].type == 'creature')
		if (gameData[player].board.length == maxBoardSize) {
			sendMessage(connections[gameData[player].id], 'error', 'No space for this creature');
			return false;
		}
	else if ( gameData[player].hand[index].type == 'weapon')
		if (Object.keys(gameData[player].weapon ).length !== 0) {
			sendMessage(connections[gameData[player].id], 'error', 'Already have a weapon');
			return false;
		}
	return true;
}


function attack(message, gameData, sendMessage) {
	let player = (gameData.player1.id == message.playerId) ? 'player1' : 'player2';
	let adversary = (gameData.player1.id == message.playerId) ? 'player2' : 'player1';
	let cardsData;

	if (player != gameData.playing) {
		sendMessage(connections[gameData[player].id], 'error', 'Wait your turn to play');
		return;
	}
	cardsData = validateAttack(message, gameData, player, adversary, sendMessage) 
	if (cardsData == false) {
		return;
	}

	// Attacking face
	if (cardsData.indexDef == -1) {
		attackFace(gameData, cardsData, adversary);
		sendMessage(connections[gameData.player1.id], 'update-hp', {
			local: gameData.player1.HP,
			adversary: gameData.player2.HP
		});
		sendMessage(connections[gameData.player2.id], 'update-hp', {
			local: gameData.player2.HP,
			adversary: gameData.player1.HP
		});
		sendMessage(connections[gameData.player1.id], 'update-board', {
			local: gameData.player1.board,
			adversary: gameData.player2.board 
		});
		sendMessage(connections[gameData.player2.id], 'update-board', {
			local: gameData.player2.board,
			adversary: gameData.player1.board
		});
	} 
	else {
		attackCreature(gameData, cardsData, player, adversary);
		console.log("SENDING MESSAGES");
		sendMessage(connections[gameData.player1.id], 'update-board', {
			local: gameData.player1.board,
			adversary: gameData.player2.board 
		});
		sendMessage(connections[gameData.player2.id], 'update-board', {
			local: gameData.player2.board,
			adversary: gameData.player1.board
		});
	}
}

function attackCreature(gameData, cardsData, player, adversary) {
	console.log("ATTACKING CREATURE");
	let attacker = cardsData.card;
	let defender = gameData[adversary].board[cardsData.indexDef];
	attacker.cHP -= defender.cAtk;
	defender.cHP -= attacker.cAtk;
	attacker.actions -= 1;

	// Check if attacking creature died
	if (attacker.cHP <= 0) {
		// Deathrattle
		// Move to graveward
		gameData[player].graveward.push(attacker)
		gameData[player].board.splice(cardsData.indexAtk,1);
	}

	// Check if defending creature died
	if (defender.cHP <= 0) {
		// Deathrattle
		// Move to graveward
		gameData[adversary].graveward.push(defender)
		gameData[adversary].board.splice(cardsData.indexDef,1);
	}
}

function attackFace(gameData, cardsData, adversary) {
	let attacker = cardsData.card;
	gameData[adversary].HP -= attacker.cAtk;
	attacker.actions -= 1;

	if (gameData[adversary].HP <= 0) {
		gameData.status = GameStatus.ending;
	}
}

function validateAttack(message, gameData, player, adversary, sendMessage) {
	let indexDef;
	let indexAtk;
	let taunt;
	let card;

	indexAtk = gameData[player].board.findIndex(x => x.uid == message.attacker);
	if (indexAtk == -1) {
		sendMessage(connections[gameData[player].id], 'error', 'Invalid attacker: card not on board');
		return false;
	}

	card = gameData[player].board[indexAtk];
	if (card.actions == 0) {
		sendMessage(connections[gameData[player].id], 'error', 'Invalid attacker: card cannot play this turn');
		return false;
	}

	if (message.defender != -1) {
		indexDef = gameData[adversary].board.findIndex(x => x.uid == message.defender);
		if (indexDef == -1) {
			sendMessage(connections[gameData[player].id], 'error', 'Invalid defender: card not on board');
			return false;
		}
	} else {
		indexDef = -1;
	}

	taunt = gameData[adversary].board.findIndex(x => x.specs.abilities.hasOwnProperty('taunt'));
	if (taunt != -1 && (indexDef == -1 || !gameData[adversary].board[indexDef].specs.abilities.hasOwnProperty('taunt'))) {
		sendMessage(connections[gameData[player].id], 'error', 'Invalid defender: you must attack the card with taunt');
		return false;
	}
	return {
		indexAtk: indexAtk,
		card: card,
		indexDef: indexDef
	}
}

function performBatchActions(tempo) {
	console.log("Performing batch actions");
}

function pickRandom(values) {
	let pick = Math.floor(Math.random()*(values.length-1));
	return values[pick];
}

function drawCards(deck, nb=1) {
	let cards = [];
	for(var i = 0; i < nb; i++) {
		let select = Math.floor(Math.random()*(deck.length-1));
		cards[i] = deck[select];
		deck.splice(select, 1);
	}
	return cards;
}

function sendMessage(connection, command, message) {
	connection.sendUTF(JSON.stringify({
			issuer: 'game-manager',
            message: message,
            command: command
    }));
}

function getGameData(message) {
	return db.get(message.gameId)
	.then((data) => {
		return JSON.parse(data.toString());
	})
}

function saveGameData(gameData, id) {
	db.put(id, JSON.stringify(gameData));
}

function route (connection, message) {
	getGameData(message)
	.then((gameData) => {
		switch (message.command) {
			case 'end-turn':
				endTurn(message, gameData, sendMessage);
				break;
			case 'swap-cards':
				swapCards(message, gameData, sendMessage);
				break;
			case 'play-card':
				playCard(message, gameData, sendMessage);
				break;
			case 'attack':
				attack(message, gameData, sendMessage);
				break;
			case 'hero-power':
				useHeroPower(message, gameData, sendMessage);
				break;
		}
		saveGameData(gameData, message.gameId);
	})
}

module.exports = {
	route,
	initGame,
	swapCards,
	playCard,
	attack,
	endTurn
}