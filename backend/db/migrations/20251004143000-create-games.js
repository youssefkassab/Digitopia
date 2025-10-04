'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('games', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      grade: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      unit: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      lesson: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      img: {
        type: Sequelize.STRING(500),
        allowNull: false
      },
      gameurl: {
        type: Sequelize.STRING(500),
        allowNull: false,
        unique: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Add indexes for better performance
    await queryInterface.addIndex('games', ['grade', 'unit']);
    await queryInterface.addIndex('games', ['name']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('games');
  }
};
