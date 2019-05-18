'use strict';
module.exports = (sequelize, DataTypes) => {
  var Player = sequelize.define('Player', {
    gamerTag: DataTypes.STRING,
    MMR: DataTypes.INTEGER,
    password: DataTypes.STRING
  }, {});
  Player.associate = function(models) {
    Player.hasMany(models.Deck);
    Player.hasMany(models.MatchLog);
    //Player.belongsTo(models.MatchLog, {as: 'player2', foreignKey:'id'});
  }
  return Player;
};