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
        type: Sequelize.ENUM(["ON-GOING", "ARCHIVED", "LOBBY"]),
        defaultValue: "LOBBY"
      },
      player1: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Players",
          key: "id"
        }
      },
      player2: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Players",
          key: "id"
        }
      },
      deck1: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Decks",
          key: "id"
        }
      },
      deck2: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "Decks",
          key: "id"
        }
      },
      PlayerId: {
        allowNull: true,
        type: Sequelize.INTEGER,
        references: {
          model: "Players",
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
