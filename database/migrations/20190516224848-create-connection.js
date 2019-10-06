"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Connections", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      token: {
        type: Sequelize.STRING
      },
      lastAccessed: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()")
      },
      PlayerId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Players",
          key: "id"
        },
        allowNull: false
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
    return queryInterface.dropTable("Connections");
  }
};
