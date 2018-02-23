const Deck = require('../models').Deck;
const Card = require('../models').Card;
const Job = require('../models').Job;
const Deck_Card = require('../models').Deck_Card;
const formatter = require('./formatter');


function format(decks) {
  let formattedElements =[];
  for(let i = 0; i < decks.length ; i++) {
    formattedElements[i] = decks[i].dataValues;
    formattedElements[i].Cards = formatCards(formattedElements[i].Cards);
    formattedElements[i].Job = decks[i].Job.dataValues;
  }
  return formattedElements;
}

function formatCards(cards) {
  let formattedCards = [];
  for(let j = 0; j < cards.length ; j++) {
      formattedCards[j] = cards[j].dataValues;
      delete formattedCards[j].createdAt;
      delete formattedCards[j].updatedAt;
    }
  return formattedCards;
}
function formatOne(deck) {
  let formattedElement = deck.dataValues;
  formattedElement.Cards = formatCards(deck.Cards);
  formattedElement.Job = deck.Job.dataValues;
  delete formattedElement.createdAt;
  delete formattedElement.updatedAt;
  return formattedElement;
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
  },
   getById(id) {
    return Deck
      .findOne({
        where: {
          id : id
        },
        include: [Card, {
          model: Job,
          as: 'Job'
        }, Deck_Card]
      })
      .then(formatOne);
  }
};