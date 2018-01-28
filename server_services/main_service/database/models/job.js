'use strict';
module.exports = (sequelize, DataTypes) => {
  var Job = sequelize.define('Job', {
    name: DataTypes.STRING,
    img: DataTypes.STRING,
    specs: DataTypes.JSON
  }, {
    classMethods: {
      associate: function(models) {
      }
    }
  });
  return Job;
};