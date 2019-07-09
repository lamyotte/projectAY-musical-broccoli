"use strict";
module.exports = (sequelize, DataTypes) => {
  const MatchLog = sequelize.define(
    "MatchLog",
    {
      matchToken: DataTypes.STRING,
      status: DataTypes.ENUM(["ON-GOING", "ARCHIVED"])
    },
    {}
  );
  MatchLog.associate = function(models) {
    MatchLog.belongsTo(models.Player, {
      foreignKey: "player1"
    });

    MatchLog.belongsTo(models.Player, {
      foreignKey: "player2"
    });

    MatchLog.belongsTo(models.Deck, {
      foreignKey: "deck1"
    });

    MatchLog.belongsTo(models.Deck, {
      foreignKey: "deck2"
    });
  };
  return MatchLog;
};
