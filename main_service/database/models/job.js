'use strict';
module.exports = (sequelize, DataTypes) => {
  var Job = sequelize.define('Job', {
    name: DataTypes.STRING,
    img: DataTypes.STRING,
    specs: DataTypes.JSONB
  }, {});
  Job.associate = function(models) {
    Job.hasMany(models.Deck);
    Job.hasMany(models.Card);
  }
  return Job;
};