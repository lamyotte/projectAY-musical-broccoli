const Deck = require('../models').Deck;
const Card = require('../models').Card;
const Job = require('../models').Job;
const Deck_Card = require('../models').Deck_Cards;
const formatter = require('./formatter');


function formatDeck(data) {
  let deck = {
    cards: [],
    job : data[0].Deck.Job.dataValues
  };
  delete deck.job.createdAt;
  delete deck.job.updatedAt;
  for(let i = 0; i < data.length; i++) {
    deck.cards[i] = data[i].Card.dataValues;  
    delete deck.cards[i].createdAt;
    delete deck.cards[i].updatedAt;
  }
  return deck;
}

module.exports = {
   getByDeck(id) {
    return Deck_Card
      .findAll({
        where: {
          DeckId : id
        },
        include: [{
          model:Card
        },{
          model: Deck,
          include: [{
            model:Job
          }]
        } ]
      })
      .then(formatDeck);
  }
};