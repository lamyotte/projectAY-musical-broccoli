'use strict';

const cards = require('./cards.js').cards;
const Card = require('../models').Card;

module.exports = {
  up: (queryInterface, Sequelize) => {
    let promises = [];
    for(let i = 0; i < cards.length; i++) {
      promises[i] = Card.create(cards[i]);
    }
    return Promise.all(promises)
    .then(() => {
    	return queryInterface.bulkInsert('Decks', [], {});
    })
  },
  down: (queryInterface, Sequelize) => {
  }
};
