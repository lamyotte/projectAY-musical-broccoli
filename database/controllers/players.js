const Player = require('../models').Player;
const Deck = require('../models').Deck;
const formatOne= require('./formatter').formatOne;
const formatMany= require('./formatter').formatMany;

module.exports = {
  create(tag, mmr) {
    return Player
      .create({
    		gamerTag: tag,
    		MMR: mmr
      })
      .then(formatOne)
      .catch(error => console.log(error));
  },
  list() {
    return Player
      .all()
      .then(formatMany)
      .catch(error => console.log(error));
  },
  getById(id) {
    return Player.findByPk(id)
      .then(formatOne);
  },
  getByTag(tag) {
    return Player.findOne({
        where: {
          gamerTag: tag
        }
    })
    .then(formatOne);
  },
  getByTagPassword(tag, password) {
    return Player.findOne({
        where: {
          gamerTag: tag,
          password: password
        }
    })
    .then(formatOne);
  },
  search(params) {
    return Player.findAll({where: params})
    .then(formatMany);
  }
};