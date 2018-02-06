
const Job = require('../models').Job;
const jobs = require('./init_data/jobs.js').jobs;

const cards = require('./init_data/cards.js').cards;
const Card = require('../models').Card;

const players = require('./init_data/players.js').players;
const Player = require('../models').Player;

const Deck = require('../models').Deck;

function formatMany(object) {
  let formattedObjects =[];
  for(let i = 0; i < object.length ; i++) {
    formattedObjects[i] = object[i].dataValues;
  }
  return formattedObjects;
}

function createCards() {
	return Card.bulkCreate(cards)
		.then((res) => {
			return Card.all();
		})
		.then((res) => {
			console.log(formatMany(res));
		})
}

function createJobs() {
	return Job.bulkCreate(jobs)
		.then((res) => {
			console.log('ok');
			return Job.all();
		})
		.then((res) => {
			console.log(formatMany(res));
		})
}

function createPlayers() {
	return Player.bulkCreate(players)
		.then((res) => {
			return Player.all();
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
	.then(() => {
		return Deck.all();
	})
	.then((deck) => {
		return Promise.all([deck[0].addCards([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]), 
							deck[1].addCards([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15])])
	})
	.then(() => {
		return Deck.findAll({
			include: { model: Card, required: true}
		});
	})
	.then((res) => {
		console.log(formatMany(res));
	})
}

function main() {
	return Promise.all([
		createCards(),
		createJobs(),
		createPlayers()
	]).then(() => {
		return createDecks();
	})	
	.catch((err) => {
		console.log(err);
	})
}

main().then(process.exit);;
