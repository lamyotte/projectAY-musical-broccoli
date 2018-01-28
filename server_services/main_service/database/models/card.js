'use strict';
module.exports = (sequelize, DataTypes) => {
  var Card = sequelize.define('Card', {
    name: DataTypes.STRING,
    img: DataTypes.STRING,
    specs: DataTypes.JSON
  }, {
    classMethods: {
      associate: function(models) {
        Card.belongsToMany(models.Deck, {through: 'CardDeck' });
      }
    }
  });
  return Card;
};