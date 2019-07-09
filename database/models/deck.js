"use strict";
module.exports = (sequelize, DataTypes) => {
  var Deck = sequelize.define(
    "Deck",
    {
      localId: DataTypes.INTEGER
    },
    {}
  );
  Deck.associate = function(models) {
    Deck.belongsToMany(models.Card, {
      through: "Deck_Cards",
      foreignKey: "DeckId"
    });
    Deck.hasOne(models.Player, { foreignKey: "id", as: "Owner" });
    Deck.hasOne(models.Job, { foreignKey: "id" });
  };
  return Deck;
};
