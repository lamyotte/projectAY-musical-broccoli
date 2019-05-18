
const Job = require('../models').Job;
const jobs = require('./init_data/jobs.js').jobs;

const cards = require('./init_data/cards.js').cards;
const cards_blm = require('./init_data/cards_blm.js').cards;
const cards_drg = require('./init_data/cards_drg.js').cards;
const Card = require('../models').Card;

const players = require('./init_data/players.js').players;
const Player = require('../models').Player;

const Deck = require('../models').Deck;

const MatchLog = require('../models').MatchLog;

const Connection = require('../models').Connection;

function formatMany(object) {
  let formattedObjects =[];
  for(let i = 0; i < object.length ; i++) {
    formattedObjects[i] = object[i].dataValues;
  }
  return formattedObjects;
}

function createCards() {
	return Card.bulkCreate(cards)
		.then((card) =>{
			Card.bulkCreate(cards_blm)
		})
		.then((card) =>{
			Card.bulkCreate(cards_drg)
		})
}

function createJobs() {
	return Job.bulkCreate(jobs)
		.then((res) => {
			console.log('ok');
		})
}

function createPlayers() {
	return Player.bulkCreate(players)
		.then((res) => {
			return Player.findAll();
		})
		.then((res) => {
			console.log(formatMany(res));
		})
}


function createDecks() {
	return Deck.bulkCreate([{
		PlayerId: 1,
		JobId: 1,
	}, {
		PlayerId: 2,
		JobId: 2,
	}])
	.then((deck) => {
		console.log(deck);
		//deck[0].addCard([1,2,3,4,5,6,7,8,9,10,11,12,13,14,1,2,3,4,5,6,7,8,9,10,11,12,13,14]);
		//deck[1].addCard([1,2,3,4,5,6,7,8,9,10,11,12,13,14,1,2,3,4,5,6,7,8,9,10,11,12,13,14]);
	})
}

function addCardsToDeck(){
	return Deck.findAll()
	.then((decks) => {
		decks[1].addCard([21,22,23,24,26,20,25,4,6,16,17,18,19,10,14]);
		decks[1].addCard([21,22,23,24,26,20,25,4,6,16,17,18,19,10,14]);
		decks[0].addCard([27,28,29,30,42,34,35,36,37,38,2,4,39,40,11]);
		decks[0].addCard([27,28,29,30,42,34,35,36,37,38,2,4,39,40,11]);
	})
}

function generateMatchLog(){
	return MatchLog.bulkCreate([{
		matchToken: "test-game-token",
		player1: 1,
		player2: 2
	}])
}

function generateConnection(){
	return Connection.bulkCreate([{
		token: "test-connection-token-p1" ,
		PlayerId: 1
	},{
		token: "test-connection-token-p2" ,
		PlayerId: 2
	}])
}

function all() {
	createJobs()
	.then(() =>{
		return createCards();
	})
	.then(() => {
		return createPlayers();
	})
	.then(() => {
		return createDecks();
	})
	.then(() => {
		return addCardsToDeck();
	})
	.then(() => {
		return generateConnection();
	})
	.then(() => {
		return generateMatchLog();
	})
}

function main() {
	return Promise.all([
		createJobs(),
		createPlayers()
	]).then(() => {
		return createCards();// createDecks();
	})	
	.catch((err) => {
		console.log(err);
	})
}

//main().then(process.exit);;


module.exports = {
	createCards,
	createJobs,
	createPlayers,
	createDecks,
	addCardsToDeck,
	all
};

require('make-runnable');