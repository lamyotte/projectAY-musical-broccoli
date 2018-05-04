const players = require('./database/controllers/players');
const decks = require('./database/controllers/decks');
const cards = require('./database/controllers/cards');
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
              job: data[3].job,
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
		hand: gameData[gameData.playing].hand.length,
		deck: gameData[gameData.playing].deck.length
	});
}

async function playCard(message, gameData, sendMessage) {
	let player = (gameData.player1.id == message.playerId) ? 'player1' : 'player2';
	let adversary = (gameData.player1.id == message.playerId) ? 'player2' : 'player1';
	let index;
	let card;

	if (player != gameData.playing) {
		sendMessage(connections[gameData[player].id], 'error', 'Wait your turn to play');
		return;
	}

	index = gameData[player].hand.findIndex(x => x.uid == message.card);
	card = gameData[player].hand[index];

	if (!isCardValid(index, gameData, player, sendMessage))
		return;

	switch (card.type) {
		case 'creature' : 
			await playCreatureCard(gameData, card, message.index, player, message, sendMessage);
			break;
		case 'weapon' :
			playWeapon(gameData, card, player);
			break;
		case 'spell' :
			await playSpellCard(gameData, message, player, card, sendMessage);
			break;
	}
	gameData[player].mana -= card.specs.cost;
	gameData[player].hand.splice(index,1);

	sendMessage(connections[gameData.player1.id], 'update-game', {
		localBoard : gameData.player1.board,
		localHP : gameData.player1.HP, 
		adversaryHP : gameData.player2.HP,
		adversaryBoard : gameData.player2.board,
		localMana : gameData.player1.mana,
		adversaryMana : gameData.player2.mana,
		localHand :gameData.player1.hand,
		adversaryHand : gameData.player2.hand.length
	});
	sendMessage(connections[gameData.player2.id], 'update-game', {
		localBoard : gameData.player2.board,
		localHP : gameData.player2.HP, 
		adversaryHP : gameData.player1.HP,
		adversaryBoard : gameData.player1.board,
		localMana : gameData.player2.mana,
		adversaryMana : gameData.player1.mana,
		localHand :gameData.player2.hand,
		adversaryHand : gameData.player1.hand.length
	});
}

function playWeapon(gameData, weapon, player) {
	gameData[player].weapon = weapon;
	gameData[player].weapon.cDurability = gameData[player].weapon.Durability;

}

async function playSpellCard(gameData, message, player, card, sendMessage) {
	console.log('playing spell card');
	for (let i = 0; i < card.specs.effects.length; i++) {
		let effect = card.specs.effects[i];
		let potency;
		if (effect.hasOwnProperty('potency') && effect.potency.hasOwnProperty('conditions')) {
			potency = effect.potency.default;
			for (let i = 0; i < effect.potency.conditions.length; i++) {
				if (validateConditions(gameData, effect.potency.conditions[i].conditions)) {
					potency = effect.potency.conditions[i].potency;
					break;
				}
			}
		}
		else {
			potency = effect.potency;
		}
		switch (effect.type) {
			case 'dmg': {
				let repetition = (effect.hasOwnProperty('repetition')) ? effect.repetition : 1;
				for (let i = 0; i < repetition; i++) {
					let target = handleTarget(gameData, effect.target, message);
					if (target === false) {
						console.log('invalid target');
						return;
					}
					dmgTarget(potency, target);
					clearDead(gameData, target, sendMessage)
				}
				break;
			}
			case 'heal' : {
				let repetition = (effect.hasOwnProperty('repetition')) ? effect.repetition : 1;
				for (let i = 0; i < repetition; i++) {
					let target = handleTarget(gameData, effect.target, message);
					if (target === false) {
						console.log('invalid target');
						return;
					}
					healTarget(potency, target);
					clearDead(gameData, target, sendMessage)
				}
				break;
			}
			case 'draw' : {
				let target = handleTarget(gameData, effect.target, message);
				if (target === false) {
					console.log('invalid target');
					return;
				}
				target.hand.push(...drawCards(target.deck, potency));	
				break;
			}
			case 'morph' : {
				let target = handleTarget(gameData, effect.target, message);
				if (target === false) {
					console.log('invalid target');
					return;
				}
				let morph = await cards.getById(effect.morph);
				morphCreatureCard(gameData, morph, target);
				break;

			}
			case 'summon' : {
				await summonCard(gameData, effect, potency, player, sendMessage);
				break;
			}
			case 'bonus' : {
				applyBonuses(gameData, effect.bonus, card.uid, message);
				break;
			}
			case 'set' : {
				switch (effect.attribute) {
					case 'HP' : {
						let target = handleTarget(gameData, effect.target, message);
						if (target === false) {
							console.log('invalid target');
							return;
						}
						target.board[target.index].cHP = effect.set;
						target.board[target.index].cMaxHP = effect.set;
						break;
					}
					case 'Atk' : {
						let target = handleTarget(gameData, effect.target, message);
						if (target === false) {
							console.log('invalid target');
							return;
						}
						target.board[target.index].cAtk = effect.set;
						break;
					}

				}	
			}
		}
	}
}

async function summonCard(gameData, effect, potency, player, sendMessage) {
	if (effect.summon.constructor === Array) {
		for (let i = 0; i < potency; i++) {
			let pick = Math.floor(Math.random() * (effect.summon.length-1));
			let summon = await cards.getById(effect.summon[pick]);
			playCreatureCard(gameData, summon, gameData[player].board.length, player, {}, sendMessage);
		}
	} else {
		for (let i = 0; i < potency; i++) {
			let summon = await cards.getById(effect.summon);
			playCreatureCard(gameData, summon, gameData[player].board.length, player, {}, sendMessage);		
		}		
	}
}


function validateCondition(gameData, condition) {
	switch (condition.type) {
		case "family" : {
			if (findTarget(gameData, condition).index.length == 0)
				return false;
		}
	}
	return true;
}

function validateConditions(gameData, conditions) {
	for (let i = 0; i < conditions.length; i++) {
		let condition = conditions[i];
		switch (condition.type) {
			case "family" : {
				if (findTarget(gameData, condition).index.length == 0)
					return false;
			}
		}
	}
	return true;
}

function validateTargetCondition(gameData, conditions, target) {
	for (let i = 0; i < conditions.length; i++) {
		let condition = conditions[i];
		switch (condition.type) {
			case "family" : {
				if (target.board[target.index].specs.family != condition.family)
					return false;
			}
			case "location" : {
				switch (condition.location) {
					case 'local-board' : {
						if (target.board != gameData[gameData.playing].board)
							return false;
						break;
					}
					case 'adversary-board' : {
						if (target.board == gameData[gameData.playing].board)
							return false; 
						break;
					}
					case 'adversary' : {
						if (target.hasOwnProperty('HP')) {
							if (target.id == gameData[gameData.playing].id)
								return false;
						}
						else {
							if (target.board == gameData[gameData.playing].board)
								return false;
						}
						break;
					}
					case 'local' : {
						if (target.hasOwnProperty('HP')) {
							if (target.id != gameData[gameData.playing].id)
								return false;
						}
						else {
							if (target.board != gameData[gameData.playing].board)
								return false;
						}
					}
					case 'board' : {
						if (target.hasOwnProperty('tag'))
							return false;
					}
				}
			}
		}
	}
	return true;
}

function morphCreatureCard(gameData, card, target) {
	if (card.specs.abilities.hasOwnProperty('bonus')) {
		applyBonuses(gameData, card.specs.abilities.bonus, card.uid);
	}
	target.board[target.index] = card;
	target.board[target.index].cHP = target.board[target.index].specs.HP;
	target.board[target.index].cMaxHP = target.board[target.index].specs.HP;
	target.board[target.index].cAtk = target.board[target.index].specs.Atk;
	target.board[target.index].actions = 0;
	target.board[target.index].status = [];
}
async function playCreatureCard(gameData, card, index, player, message, sendMessage) {
	let adversary = (gameData.playing == 'player1') ? 'player2' : 'player1';

	if (card.specs.abilities.hasOwnProperty('bonus')) {
		applyBonuses(gameData, card.specs.abilities.bonus, card.uid);
	}

	gameData[player].board.splice(index, 0, card);
	gameData[player].board[index].cHP = gameData[player].board[index].specs.HP;
	gameData[player].board[index].cMaxHP = gameData[player].board[index].specs.HP;
	gameData[player].board[index].cAtk = gameData[player].board[index].specs.Atk;
	gameData[player].board[index].actions = 0;
	gameData[player].board[index].status = [];

	console.log(gameData[player].board);
	// check sides bonus
	// check board wide bonus
	if (gameData[player].board[index].specs.abilities.hasOwnProperty('battlecry')) {
		let battlecry = gameData[player].board[index].specs.abilities.battlecry;
		switch (battlecry.type) {
			case 'charge' : {
				gameData[player].board[index].actions += 1;
				break;
			}
			case 'heal' : {
				let target = handleTarget(gameData, battlecry.target, message);
				if (target === false) {
					/// invalid target stop !
					console.log("DIDNT FIND IT!");
					return;
				}
				else {
					healTarget(card.specs.abilities.battlecry.potency, target);	
				}
				break;
			}
			case 'dmg' : {
				let target = handleTarget(gameData, battlecry.target, message);
				if (target == -1) {
					// invalid
					return;
				}
				else {
					dmgTarget(card.specs.abilities.battlecry.potency, target);
					clearDead(gameData, target, sendMessage);
				}
				break;
			}
			case 'draw' : {
				gameData[player].hand.push(...drawCards(gameData[player].deck, battlecry.potency));
				break;
			}
			case 'bonus' : {
				applyBonuses(gameData, battlecry.bonus, card.uid, message);
				break;
			}
			case 'summon' : {
				await summonCard(gameData, battlecry, battlecry.potency, player, sendMessage);
				break;
			}
		}
	}
}

function handleTarget(gameData, targeting, message) {
	if (!targeting) {
		return findTarget(gameData, message.defender);
	}
	else if (targeting.hasOwnProperty('conditions')) {
		let target = findTarget(gameData, message.defender);
		return (validateTargetCondition(gameData, targeting.conditions, target)) ? target : false;
	}
	else {
		console.log("finding specific");
		return findTarget(gameData, targeting);
	}
}

function applyBonuses(gameData, bonuses, issuer, message) {
	for (let i = 0; i < bonuses.length; i++) {
		let bonus = bonuses[i];
		let targets = handleTarget(gameData, bonus.target, message);
		let target;
		if (!targets) {
			console.log("Invalid target");
			return -1;
		}
		if (targets.constructor !== Array) {
			if (targets.hasOwnProperty('index') && !targets.hasOwnProperty('board'))
				targets = targets.index;
			else if(!targets.hasOwnProperty('index'))
				targets = targets.board;
			else 
				targets = [targets.board[targets.index]];
		}
		for (let j = 0; j < targets.length; j++) {
			target = targets[j];
			switch (bonus.type) {
				case 'attribute' : {
					switch (bonus.attribute) {
						case 'HP' : {
							target.cHP += bonus.potency;
							target.cMaxHP += bonus.potency;
							break;
						}
						case 'Atk' : {
							target.cAtk += bonus.potency;
							break;
						}
					}
					if (target.status.hasOwnProperty(issuer)) {
						target.status[issuer].push({
							"type" : "bonus",
							"potency" : bonus.potency,
							"attribute" : bonus.attribute
						})
					}
					else {
						target.status[issuer] = [{
							"type" : "bonus",
							"potency" : bonus.potency,
							"attribute" : bonus.attribute
						}]
					}
					break;
				}
				case 'ability' : {
					console.log('ability bonus to do');
					
					break;
				}
			}
		}	
	}
}

function findTarget(gameData, uid) {
	// Multi param targetting
	let playing = gameData[gameData.playing];
	let notPlaying = (gameData.playing == 'player1') ? gameData.player2 : gameData.player1;
	if (typeof uid == 'object') {
		switch (uid.type) {
			case 'family' : {
				let targets = [];
				if (uid.location == 'local-board') {
					for (let i = 0; i < playing.board.length; i++) {
						if (playing.board[i].specs.family == uid.family)
							targets.push(playing.board[i]);
					}
				}
				/// ...
				return {
					index : targets
				}
			}
			case 'rand' : {
				console.log("RANDOM")
				if (uid.hasOwnProperty('repetition'))
					return pickRandomTargets(gameData, uid.location, uid.repetition);
				else
					return pickRandomTarget(gameData, uid.location);
			}
			case 'aoe' : {
				if (uid.hasOwnProperty('location')) {
					switch (uid.location) {
						case 'adversary-board' :
							return { board : notPlaying.board };
						case 'local-board' :
							return { board: playing.board };
						default :
							return { board: playing.board.concat(notPlaying.board) }; 
					}
				}
				else {
					console.log("Completly stupid should never be here change your db pls 2 targets = 2 effects");
					return false;
				}
			}
		}
	}
	//
	if (uid == 'local')
		return gameData[gameData.playing];
	if (uid == 'adversary')
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
	return false;
}

function pickRandomTarget(gameData, limit) {
	let playing = gameData[gameData.playing];
	let notPlaying = (gameData.playing == 'player1') ? gameData.player2 : gameData.player1;
	let pick;
	
	if (limit == "adversary-board")
		pick = Math.floor(Math.random() * ((playing.board.length+notPlaying.board.length+1) - (playing.board.length+1)) + playing.board.length+1);
	else if (limit == "adversary") 
		pick = Math.floor(Math.random() * (playing.board.length+notPlaying.board.length+1 - playing.board.length+1) + playing.board.length+1);
	else if (limit == "local-board") 
		pick = Math.floor(Math.random() * (playing.board.length-1));
	else if (limit == "local")
		pick = Math.floor(Math.random() * (playing.board.length));
	else 
		pick = Math.floor(Math.random()*(playing.board.length+notPlaying.board.length+1));

	if (pick < playing.board.length) {
		return {
			board : playing.board,
			index: pick
		}
	}
	else if (pick == playing.board.length) {
		return playing;
	}
	else if (pick < (playing.board.length + notPlaying.board.length + 1)) {
		return {
			board : notPlaying.board,
			index : pick - playing.board.length - 1
		}
	}
	else {//if (pick == (playing.board.length + notPlaying.board.length + 1)) {
		return notPlaying;
	}
}

function pickRandomTargets(gameData, limit, repetition) {
	let playing = gameData[gameData.playing];
	let notPlaying = (gameData.playing == 'player1') ? gameData.player2 : gameData.player1;
	let board;
	let pick;
	let targets = [];
	let max;
	if (limit == "adversary-board") {
		board = [...Array(gameData.notPlaying.board.length).keys()];
	}
	else if (limit == "adversary") {
		board = [...Array(gameData.notPlaying.board.length+1).keys()];
		max = gameData.notPlaying.board.length;
	}
	else if (limit == "local-board") {
		board = [...Array(gameData.playing.board.length).keys()]
	}
	else if (limit == "local") {
		board = [...Array(gameData.playing.board.length+1).keys()];
		max = gameData.playing.board.length;
	}
	else {
	}
	for (let i = 0; i < repetition; i++) {
		pick = Math.floor(Math.random() * board.length-1);
		switch (limit) {
			case 'adversary-board' :
				targets.push({
					board: notPlaying.board,
					index : board[pick]
				});
				break;
			case 'adversary' :
				if (board[pick] == max)
					targets.push(notPlaying);
				else 
					targets.push({
						board: notPlaying.board,
						index : board[pick]
					});
				break;
			case 'local-board' :
				targets.push({
					board: notPlaying.board,
					index : board[pick]
				});
				break;
			case 'local' :
				if (board[pick] == max)
					targets.push(notPlaying);
				else 
					targets.push({
						board: notPlaying.board,
						index : board[pick]
					});
				break;
		}
		board.splice(pick, 1);
	}
	return targets;
}

function dmgTarget(potency, target) {
	if (target.hasOwnProperty('HP')) {
		target.HP -= potency;
	}
	else if (!target.hasOwnProperty('index')) {
		for (let i = 0; i < target.board.length; i++) {
			target.board[i].cHP -= potency;
		}
	}
	else {
		target.board[target.index].cHP -= potency;
	}
}

function healTarget(potency, target) {
	if (target.hasOwnProperty('tag')) {
		target.HP = (target.HP + potency >=	 30) ? 30 : target.HP + potency;
	}
	else if (!target.hasOwnProperty('index')) {
		for (let i = 0; i < target.board.length; i++) {
			target.board[i].cHP -= (target.board[i].cHP + potency >= target.board[i].specs.HP) ? 
														target.board[i].specs.HP : 
														target.board[i].cHP + potency;;
		}
	}
	else {
		target.board[target.index].cHP = (target.board[target.index].cHP + potency >= target.board[target.index].specs.HP) ? 
														target.board[target.index].specs.HP : 
														target.board[target.index].cHP + potency;
	}
}

function clearDead(gameData, target, sendMessage) {
	// Look for player death
	if (target.hasOwnProperty('tag')) {
		if (target.HP <= 0) {
			endGame(sendMessage);
		}
	}
	// Look for entire board
	else if (!target.hasOwnProperty('index')) {
		for (let i = 0; i < target.board.length; i++) {
			if (target.board[i].cHP <= 0) {
				target.board.splice(i, 1);
			}
		}
	}
	// Look for one specific target
	else {
		if (target.board[target.index].cHP <= 0) {
			if (target.board[target.index].specs.abilities.hasOwnProperty('bonus'))
				removeBonus(gameData, target.board[target.index].uid);
			target.board.splice(target.index, 1);
		}
	}
}

function removeBonus(gameData, issuer) {
	let highBoard;
	let lowBoard;
	if (gameData.player1.board.length > gameData.player2.board.length) {
		lowBoard = gameData.player2.board;
		highBoard = gameData.player1.board;

	}
	else {
		lowBoard = gameData.player1.board;
		highBoard = gameData.player2.board;
	}
	for (let i = 0; i < lowBoard.length; i++) {
		revertAttribute(lowBoard[i], lowBoard[i].status[issuer]);
		revertAttribute(highBoard[i], highBoard[i].status[issuer]);
		delete lowBoard[i].status[issuer];
		delete highBoard[i].status[issuer];
	}
	for (let i = lowBoard.length; i < highBoard.length; i++) {
		revertAttribute(highBoard[i], highBoard[i].status[issuer]);
		delete highBoard[i].status[issuer];
	}
}

function revertAttribute(target, bonuses) {
	if (!bonuses)
		return;
	for (let i = 0; i < bonuses.length; i++) {
		let bonus = bonuses[i];
		switch (bonus.attribute) {
			case 'HP' : {
				target.cMaxHP -= bonus.potency;
				if (target.cHP > target.cMaxHP)
					target.cHP = target.cMaxHP;
				break;
			}
			case 'Atk' : {
				target.cAtk -= bonus.potency;
				break;
			}
		}
	}
}

function endGame(sendMessage) {
	sendMessage(connections[gameData.player1.id], 'end-game', {
		winner: (gameData.player1.HP == 0) ? gameData.player2.tag : gameData.player1.tag
	});
	sendMessage(connections[gameData.player2.id], 'end-game', {
		winner: (gameData.player1.HP == 0) ? gameData.player2.tag : gameData.player1.tag
	});
}

function useHeroPower(message, gameData, sendMessage) {
	// get job 
	// verify params
	// execute action
	if (gameData[gameData.playing].powerActions == 0) {
		console.log("no more actions");
		return;
	}
	if (gameData[gameData.playing].mana - 2 < 0) {
		console.log("no more mana");
		return;
	}
	switch (gameData[gameData.playing].job.specs.type) {
		case 'dmg': {
			// black mage
			// dragoon
			let target;
			// Check if there is a limited target
			if (gameData[gameData.playing].job.specs.hasOwnProperty('target')) {
				target = handleTarget(gameData, gameData[gameData.playing].job.specs.target, null);
				if (target === false) {
					console.log('target not found');
					return;
				}
			}
			else {
				target = handleTarget(gameData, null, message);
				if (target === false) {
					console.log('target not found');
					return;
				}
			}
			dmgTarget(gameData[gameData.playing].job.specs.potency, target);
			clearDead(gameData, target, sendMessage);
			break;
		}
		case 'heal': {
			// white mage
			let target;
			// Check if there is a limited target
			if (gameData[gameData.playing].job.specs.hasOwnProperty('target')) {
				target = handleTarget(gameData, gameData[gameData.playing].job.specs.target, null);
			}
			else {
				target = handleTarget(gameData, null, message);
				if (target === false) {
					console.log('target not found');
					return;
				}
			}
			healTarget(gameData[gameData.playing].job.specs.potency, target);
			clearDead(gameData, target, sendMessage);
			break;
		}
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
	gameData[gameData.playing].powerActions -= 1;
	gameData[gameData.playing].mana -= 2;
	sendMessage(connections[gameData.player1.id], 'update-hp', {
		local: gameData.player1.HP,
		adversary: gameData.player2.HP
	});
	sendMessage(connections[gameData.player2.id], 'update-hp', {
		local: gameData.player2.HP,
		adversary: gameData.player1.HP
	});
	sendMessage(connections[gameData.player1.id], 'update-mana', {
		local: gameData.player1.mana,
		adversary: gameData.player2.mana
	});
	sendMessage(connections[gameData.player2.id], 'update-mana', {
		local: gameData.player2.mana,
		adversary: gameData.player1.mana
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

function isCardValid(index, gameData, player, sendMessage) {
	if (index == -1) {
		sendMessage(connections[gameData[player].id], 'error', 'Card not in hand');
		return false;
	}
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

async function route (connection, message) {
	let gameData = await getGameData(message);
	switch (message.command) {
		case 'end-turn':
			endTurn(message, gameData, sendMessage);
			break;
		case 'swap-cards':
			swapCards(message, gameData, sendMessage);
			break;
		case 'play-card':
			await playCard(message, gameData, sendMessage);
			break;
		case 'attack':
			attack(message, gameData, sendMessage);
			break;
		case 'hero-power':
			useHeroPower(message, gameData, sendMessage);
			break;
	}
	saveGameData(gameData, message.gameId);
}

module.exports = {
	route,
	initGame,
	// Exposed for testing purposes
	swapCards,
	playCard,
	attack,
	endTurn,
	useHeroPower,
	pickRandomTarget,
	clearDead
}