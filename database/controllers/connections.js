const Connection = require('../models').Connection;
const formatOne= require('./formatter').formatOne;
const formatMany= require('./formatter').formatMany;

module.exports = {
  create(player) {
    return Connection
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
  search(params) {
    return Player.findAll({where: params})
    .then(formatMany);
  }
};