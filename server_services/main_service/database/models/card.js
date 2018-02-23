'use strict';
module.exports = (sequelize, DataTypes) => {
  var Card = sequelize.define('Card', {
    name: DataTypes.STRING,
    img: DataTypes.STRING,
    specs: DataTypes.JSONB
  });
  Card.associate = function (models) {
    Card.belongsToMany(models.Deck, {through: 'Deck_Cards', foreignKey: 'CardId' });
  };
  return Card;
};