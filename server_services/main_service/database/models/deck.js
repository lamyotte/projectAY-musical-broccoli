'use strict';
module.exports = (sequelize, DataTypes) => {
  var Deck = sequelize.define('Deck', {}, {
    classMethods: {
      associate: function(models) {
        Deck.belongsToMany(models.Card, {through: 'CardDeck' });
        Deck.belongsTo(models.Player, {foreignKey: 'PlayerId'});
        Deck.hasOne(model.Job, {foreignKey: 'JobId'});
      }
    }
  });
  return Deck;
};