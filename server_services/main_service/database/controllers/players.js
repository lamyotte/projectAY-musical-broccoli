const Player = require('../models').Player;

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
    .catch(error => console.log(error));
},
};