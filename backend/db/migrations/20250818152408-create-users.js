'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      national_number: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true
      },
      role: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      Grade: {
        type: Sequelize.STRING(5),
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
    await queryInterface.addIndex('users', ['email'], { unique: true, name: 'users_email_unique' });
    await queryInterface.addIndex('users', ['national_number'], { unique: true, name: 'users_national_number_unique' });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
