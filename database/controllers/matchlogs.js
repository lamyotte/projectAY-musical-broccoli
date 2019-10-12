const MatchLog = require("../models").MatchLog;
const formatOne = require("./formatter").formatOne;
const formatMany = require("./formatter").formatMany;

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
  create(player1, player2, deck1, deck2) {
    let token = generateToken(20);
    return MatchLog.create({
      matchToken: token,
      player1: player1,
      player2: player2,
      deck1: deck1,
      deck2: deck2
    })
      .then(formatOne)
      .catch(error => console.log(error));
  },
  getByTokenPlayer(token, playerId) {
    return MatchLog.findOne({
      where: {
        matchtoken: token,
        [Op.or]: [{ player1: playerId }, { player2: playerId }]
      }
    })
      .then(formatOne)
      .catch(error => console.log(error));
  },
  getByToken(token) {
    return MatchLog.findOne({
      where: {
        matchToken: token
      }
    })
      .then(formatOne)
      .catch(error => console.log(error));
  },
  updateStatus(id, status) {
    return MatchLog.update(
      { status: status },
      {
        where: {
          id: id
        }
      }
    )
      .then(formatOne)
      .catch(error => console.log(error));
  }
};
