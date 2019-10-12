const Connection = require("../models").Connection;
const formatOne = require("./formatter").formatOne;
const formatMany = require("./formatter").formatMany;
const players = require("./players");

function generateToken(length) {
  let token = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return token;
}

module.exports = {
  create(player) {
    return Connection.create({
      PlayerId: player,
      token: generateToken(32)
    })
      .then(formatOne)
      .catch(error => console.log(error));
  },
  getPlayer(token) {
    return Connection.findOne({
      where: {
        token: token
      }
    })
      .then(formatOne)
      .then(connection => {
        return players.getById(connection.PlayerId);
      });
  },
  getByPlayerToken(token) {
    return Connection.findOne({
      where: {
        token: token
      }
    })
      .then(formatOne)
      .then(connection => {
        return players.getById(connection.PlayerId);
      });
  }
};
