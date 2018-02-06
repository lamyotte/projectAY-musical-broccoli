const Card = require('../models').Card;

module.exports = {
  list()  {
    return Card.all();
  },
  getById() {
    return Card.findOne
  },
  search() {

  }
};