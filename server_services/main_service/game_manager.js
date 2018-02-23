const players = require('./database/controllers/players');
const decks = require('./database/controllers/decks');
const deck_card = require('./database/controllers/deck_card');

const startingCards = 3; 

var levelup = require('levelup')
var leveldown = require('leveldown')
var async = require('async');

var db = levelup(leveldown('./ay-game-db'))

var lastId = 0;

var connections = {};

function initGame(player1, player2) {
	// get data
	// 		get job abilities
	// 		get deck cards
	// validate data
	// shuffle decks
	// pick started cards
	// pick a starter
	// 2) Put a key & value
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
              job: data[2].job,
              hand: drawCards(data[2].cards,startingCards),
              manapool: 0,
              deck: data[2].cards,
              graveward: [],
              deckid: 1
          },
          player2: {
              id: player2.id,
              job: data[2].job,
              hand: drawCards(data[3].cards,startingCards),
              manapool: 0,
              deck: data[3].cards,
              graveward: [],
              deckid: 2
          },
          playing: pickRandom(['player1', 'player2'])
		};
		lastId++;
		return db.put(lastId, JSON.stringify(gameData));
	})
	.then(() => {
		return  db.get(lastId);
	})
	.then((res) => {
		let gameData = JSON.parse(res.toString());
		console.log(JSON.parse(res.toString()));
		sendMessage(connections[player1.id], 'init-game', gameData.player1.hand);
		sendMessage(connections[player2.id], 'init-game', gameData.player2.hand);
	})
	.catch((err) => {
		console.log(err);
	})
	
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
	switch (message.command) {
		case 'get-decks':
			getDeck(connection,message);
	}
}

module.exports = {
	route,
	initGame
}