"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Decks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      localId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      JobId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Jobs",
          key: "id"
        }
      },
      PlayerId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Players",
          key: "id"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()")
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Decks");
  }
};
