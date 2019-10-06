const Connection = require("../models").Connection;
const formatOne = require("./formatter").formatOne;
const formatMany = require("./formatter").formatMany;

module.exports = {
  create(player) {
    return Connection.create({
      PlayerId: player,
      token: "111111111111"
    })
      .then(formatOne)
      .catch(error => console.log(error));
  }
};
