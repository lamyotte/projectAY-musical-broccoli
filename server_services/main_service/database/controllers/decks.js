const Deck = require('../models').Deck;
const Card = require('../models').Card;
const Job = require('../models').Job;
const formatter = require('./formatter');


function format(decks) {
  console.log(decks);
  let formattedElements =[];
  for(let i = 0; i < decks.length ; i++) {
    formattedElements[i] = decks[i].dataValues;
    formattedElements[i].cards = formatter.formatMany(decks[i].cards);
    formattedElements[i].job = decks[i].job.dataValues;
  }
  return formattedElements;
}

module.exports = {
  create(playerId,jobId,cards) {
    return Deck
      .create({
        PlayerId: playerId,
        JobId: jobId
      })
      .then((deck) => {
        deck.addCards(cards);
      })
      .catch(error => console.log(error));
  },
  list() {
    return Deck
      .all()
      .then(formatter.formatMany)
      .catch(error => console.log(error));
  },
  getByPlayer(playerId) {
    console.log(playerId);
    return Deck
      .findAll({
        where: {
          PlayerId : playerId
        },
        include: [{
          model: Job,
          as: 'JobId'
        }]
      })
      .then(format);
  }
};