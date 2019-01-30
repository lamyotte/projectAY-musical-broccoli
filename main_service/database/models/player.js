'use strict';
module.exports = (sequelize, DataTypes) => {
  var Player = sequelize.define('Player', {
    gamerTag: DataTypes.STRING,
    MMR: DataTypes.INTEGER
  }, {});
  Player.associate = function(models) {
    Player.hasMany(models.Deck);
  }
  return Player;
};