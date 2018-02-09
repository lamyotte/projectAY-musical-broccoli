const Card = require('../models').Card;
const formatter = require('./formatter');

module.exports = {
  list()  {
    return Card.all()
      .then(formatter.formatMany);
  },
  getById(id) {
    return Card.findById(id)
      .then(formatter.formatOne);
  },
  search(params) {
    return Card.findAll({where: params});
  }
};