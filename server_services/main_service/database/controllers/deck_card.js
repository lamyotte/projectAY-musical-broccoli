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
    deck.cards[i].type = deck.cards[i].specs.type;
    delete deck.cards[i].specs.type; 
    deck.cards[i].uid = data[i].id;
  }
  console.log(deck.cards[0]);
  return deck;
}

module.exports = {
   getByDeck(id) {
    return Deck_Card
      .findAll({
        attributes: ['id', 'DeckId', 'CardId'],
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