const Connection = require('../models').Connection;
const formatOne= require('./formatter').formatOne;
const formatMany= require('./formatter').formatMany;

function generateToken(length) {
  let token           = '';
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    token += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return token;
}

module.exports = {
  create(playerId) {
    let token = generateToken(12)
    return Connection
      .create({
    		PlayerId: playerId,
    		token: token
      })
      .then(formatOne)
      .catch(error => console.log(error));
  },
  getByToken(token) {
    return Connection.findOne({
      where: {
        token: token
      }
    })
      .then(formatOne);
  },
  getByPlayer(player) {
    return Connection.findOne({
        where: {
          PlayerId: player
        }
    })
    .then(formatOne);
  }
};