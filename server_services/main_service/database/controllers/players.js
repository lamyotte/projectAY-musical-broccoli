const Player = require('../models').Player;

function formatMany(players) {
  console.log(players);
  let formattedPlayers =[];
  for(let i = 0; i < players.length ; i++) {
    formattedPlayers[i] = players[i].dataValues;
  }
  return formattedPlayers;
}

function formatOne(player) {
  console.log(player);
  console.log('/////////////////////////')
  return player.dataValues;
}

module.exports = {
  create(req, res) {
    return Player
      .create({
		GamerTag: 'Livvy',
		MMR:25
      })
      .catch(error => console.log(error));
  },
  list(req, res) {
  return Player
    .all()
    .then(formatMany)
    .catch(error => console.log(error));
},
};