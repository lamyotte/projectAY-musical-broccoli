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
              weapon: {}
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
              weapon: {}
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
		console.log(connections);
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

function swapCards(message, gameData, sendMessage=sendMessage) {
	let player = (gameData.player1.id == message.playerId) ? 'player1' : 'player2';
	if (gameData[player].hasOwnProperty('swapped')) {
		sendMessage(connections[gameData[player].id], 'error', 'Cards already swapped please wait');
		return;
	}
	let swappedCards = [];
	for (let i = 0; i < message.swaps.length; i++) {
		let index = gameData[player].hand.findIndex(x => x.id == message.swaps[i]);
		swappedCards.push(gameData[player].hand[index]);
		gameData[player].hand.splice(index, 1, drawCards(gameData[player].deck)[0]);
	}
	gameData[player].deck.push(swappedCards);
	gameData[player].swapped = swappedCards.length;
	sendMessage(connections[gameData[player].id], 'swap-cards', {
		id: message.id,
		local: {
			hand: gameData[player].hand
		}
	});
	if(gameData.player1.hasOwnProperty('swapped') && gameData.player2.hasOwnProperty('swapped')) {
		sendMessage(connections[gameData.player1.id], 'swap-cards-completed', gameData.player2.swapped);
		sendMessage(connections[gameData.player2.id], 'swap-cards-completed', gameData.player1.swapped);
	}
}

function endTurn(connection, message, gameData) {
	// Do end turn actions !
	performBatchActions(gameData);
	// New turn setup
	gameData.playing = (gameData.playing == 'player1') ? 'player2' : 'player1';
	gameData[gameData.playing].manapool = (gameData[gameData.playing].manapool < 10) ? 
											gameData[gameData.playing].manapool + 1 : 
											gameData[gameData.playing].manapool; 
	gameData[gameData.playing].hand.push(drawCards(gameData[gameData.playing].deck, 1));
	// Do begin turn actions
	performBatchActions(gameData);
	sendMessage(connections[gameData.player1.id], 'update-game', gameData);
	sendMessage(connections[gameData.player1.id], 'update-game', gameData);
	sendMessage(connections[gameData.playing], 'start-turn', gameData);
}

function playCard(message, gameData, sendMessage=sendMessage) {
	let player = (gameData.player1.id == message.playerId) ? 'player1' : 'player2';
	let index;
	let card;

	if (player != gameData.playing) {
		sendMessage(connections[gameData[player].id], 'error', 'Wait your turn to play');
		return;
	}

	index = gameData[player].hand.findIndex(x => x.id == message.card);
	card = gameData[player].hand[index];

	if (!isCardValid(index, gameData, player, sendMessage))
		return;

	switch (card.type) {
		case 'creature' : 
			playCreatureCard(gameData, index, message.index, player);
			break;
		case 'weapon' :
			playWeapon(gameData, card, player);
			break;
		case 'spell' :
			playSpellCard(gameData, message, player);
			breakl
	}

	gameData[player].mana -= card.specs.cost;
	gameData[player].hand.splice(index,1);
}

function playWeapon(gameData, weapon, player) {
	gameData[player].weapon = weapon;
	gameData[player].weapon.cDurability = gameData[player].weapon.Durability;

}

function playSpellCard(gameData, message) {
	console.log('playing spell card');
}
 
function playCreatureCard(gameData, card, index, player) {
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

		} else if (battlecry.type == 'dmg') {
			
		} else if (battlecry.type == 'draw') {
			gameData[player].hand.push(...drawCards(gameData[player].deck, battlecry.potency));
		}
	}
}

function dmgTarget(potency, target, playerData) {
	let creature = playerData.board[target];
	creature.cHP -= potency;
	if (creature.cHP <= 0) {
		playerData.board.splice(target,1);
		playerData.graveward.push(creature);
	}
}

function healTarget(potency, target) {

}


function isCardValid(index, gameData, player, sendMessage=sendMessage) {
	if (index == -1) {
		sendMessage(connections[gameData[player].id], 'error', 'Card not in hand');
		return false;
	}
	if (gameData[player].mana - gameData[player].hand[index].cost < 0) {
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

function attack(message, gameData, sendMessage=sendMessage) {
	console.log("TO DO");
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
	console.log(message);
	getGameData(message)
	.then((gameData) => {
		switch (message.command) {
			case 'end-turn':
				endTurn(message,gameData);
			case 'swap-cards':
				swapCards(message,gameData);
		}
		saveGameData(gameData, message.gameId);
	})
}

module.exports = {
	route,
	initGame,
	swapCards,
	playCard,
	attack
}