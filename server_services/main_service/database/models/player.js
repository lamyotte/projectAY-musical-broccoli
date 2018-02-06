'use strict';
module.exports = (sequelize, DataTypes) => {
  var Player = sequelize.define('Player', {
    gamerTag: DataTypes.STRING,
    MMR: DataTypes.INTEGER
  }, {});
  return Player;
};