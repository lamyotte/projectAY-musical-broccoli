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

function swapCards(connection, message) {
	console.log("yep");
	db.get(message.gameId)
		.then((data) => {
			let gameData = JSON.parse(data.toString());
			let player = (gameData.player1.id == message.playerId) ? 'player1' : 'player2';
			if (gameData[player].hasOwnProperty('swapped')) {
				console.log("swapped already");
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
			console.log(gameData[player].swapped);
			if(gameData.player1.hasOwnProperty('swapped') && gameData.player2.hasOwnProperty('swapped')) {
				sendMessage(connections[gameData.player1.id], 'swap-cards-completed', gameData.player2.swapped);
				sendMessage(connections[gameData.player2.id], 'swap-cards-completed', gameData.player1.swapped);
			}
			return db.put(message.gameId, JSON.stringify(gameData));
		})
}

function endTurn(connection, message) {
	///TODO 
	///validate connection data
	/// {
	/// 	gameId : ...
	/// }
	let gameData;
	db.get(message.gameId)
	.then((data) => {
		gameData = data;
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
		return db.put(lastId, JSON.stringify(gameData));
	})
	.then(() => {
		sendMessage(connections[gameData.player1.id], 'update-game', gameData);
		sendMessage(connections[gameData.player1.id], 'update-game', gameData);
		sendMessage(connections[gameData.playing], 'start-turn', gameData);
	})
}

function playCard(connection, message) {
	// validate connection
	// check if player has card in hand
	// check if player has enough mana left 
	// if creature card
	// 	check if the board has enough place left
	// if weapon card
	//  check if weapon already equiped
	// if spell card 
	// 	nothing
	// 	
	// play the card 
	// if creature card 
	//   place on board at good index
	//   check side bonus
	//   check board wide bonus 
	//   check battlecry
	// if weapon
	// 	 place on weapon slot
	// if spell card
	// 	 check target 
	// 	 apply spell
	// 
	// remove card from hand
	// remove cost from mana
	// 
	// send updates
}

function validateCard(cardId, gameData) {
	let card = gameData[gameData.playing].hand.filter(curr => (curr.id === cardId));
	if (!card)
		return false; 
	if (gameData[gameData.playing].mana - card.cost < 0)
		return false;
	if (card.type == 'creature')
		if (gameData[gameData.playing].board.length == maxBoardSize)
			return false;
	else if (card.type == 'weapon')
		if (Object.keys(gameData[gameData.playing].weapon ).length !== 0)
			return false;
	return true;

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

function route (connection, message) {
	console.log(message);
	switch (message.command) {
		case 'end-turn':
			endTurn(connection,message);
		case 'swap-cards':
			swapCards(connection,message);
	}
}

module.exports = {
	route,
	initGame
}