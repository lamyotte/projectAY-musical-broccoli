'use strict';
module.exports = (sequelize, DataTypes) => {
  const Connection = sequelize.define('Connection', {
    active: DataTypes.BOOLEAN,
    token: DataTypes.STRING,
    lastAccessed: DataTypes.DATE,
    PlayerId: DataTypes.INTEGER
  }, {});
  Connection.associate = function(models) {
    Connection.hasOne(models.Player, {foreignKey: 'id'});
  };
  return Connection;
};