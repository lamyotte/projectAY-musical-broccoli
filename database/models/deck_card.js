"use strict";
module.exports = (sequelize, DataTypes) => {
  var Deck_Cards = sequelize.define("Deck_Cards", {}, {});
  Deck_Cards.associate = function(models) {
    Deck_Cards.belongsTo(models.Deck);
    Deck_Cards.belongsTo(models.Card);
  };
  return Deck_Cards;
};
