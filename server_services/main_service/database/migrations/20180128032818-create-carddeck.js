'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('CardDeck', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      CardId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Cards',
          key: 'id'
        }
      },
      DeckId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Decks',
          key: 'id'
        }
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('CardDeck');
  }
};
