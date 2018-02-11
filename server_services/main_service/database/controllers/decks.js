const Deck = require('../models').Deck;
const Card = require('../models').Card;
const Job = require('../models').Job;
const formatter = require('./formatter');


function format(decks) {
  let formattedElements =[];
  for(let i = 0; i < decks.length ; i++) {
    formattedElements[i] = decks[i].dataValues;
    formattedElements[i].Cards = formatter.formatMany(decks[i].Cards);
    formattedElements[i].Job = decks[i].Job.dataValues;
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
    return Deck
      .findAll({
        where: {
          PlayerId : playerId
        },
        include: [Card, {
          model: Job,
          as: 'Job'
        }]
      })
      .then(format);
  }
};