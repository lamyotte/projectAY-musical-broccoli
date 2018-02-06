const Deck = require('../models').Deck;

function format(deck) {
  return deck.dataValues;
}

module.exports = {
  create(playerId) {
    return Deck
      .create({
        PlayerId: playerId
      })
      .catch(error => console.log(error));
  },
  list() {
  return Deck
    .all()
    .then(format)
    .catch(error => console.log(error));
  }
};