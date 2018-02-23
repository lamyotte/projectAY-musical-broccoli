'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Deck_Cards', {
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
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Deck_Card');
  }
};
