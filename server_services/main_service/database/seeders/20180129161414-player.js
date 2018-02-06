'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Players', [{
        GamerTag: 'Livvy',
        MMR: '25'
      }], {});
  },
  down: {
  }
};
