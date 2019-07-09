"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("MatchLogs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      matchToken: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM(["ON-GOING", "ARCHIVED"]),
        defaultValue: "ON-GOING"
      },
      player1: {
        type: Sequelize.INTEGER,
        references: {
          model: "Players",
          key: "id"
        }
      },
      player2: {
        type: Sequelize.INTEGER,
        references: {
          model: "Players",
          key: "id"
        }
      },
      deck1: {
        type: Sequelize.INTEGER,
        references: {
          model: "Decks",
          key: "id"
        }
      },
      deck2: {
        type: Sequelize.INTEGER,
        references: {
          model: "Decks",
          key: "id"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("MatchLogs");
  }
};
