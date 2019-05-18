'use strict';
module.exports = (sequelize, DataTypes) => {
  const Card = sequelize.define('Card', {
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    description: DataTypes.STRING,
    lore: DataTypes.STRING,
    img: DataTypes.STRING,
    specs: DataTypes.JSONB
  }, {});
  Card.associate = function(models) {
    // associations can be defined here
    Card.associate = function (models) {
      Card.belongsToMany(models.Deck, {through: 'Deck_Cards', foreignKey: 'CardId' });
      Card.hasOne(models.Job, {foreignKey: 'id'});
    };
  };
  return Card;
};