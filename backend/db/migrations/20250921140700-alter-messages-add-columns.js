'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add missing columns used by controllers
    await queryInterface.addColumn('messages', 'content', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.addColumn('messages', 'seen', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn('messages', 'message_date', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await queryInterface.addColumn('messages', 'message_time', {
      type: Sequelize.TIME,
      allowNull: true,
    });

    // Relax NOT NULL constraints on unused legacy columns so existing inserts don't fail
    await queryInterface.changeColumn('messages', 'receiver', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.changeColumn('messages', 'title', {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
    await queryInterface.changeColumn('messages', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn('messages', 'date', {
      type: Sequelize.DATEONLY,
      allowNull: true,
    });
    await queryInterface.changeColumn('messages', 'time', {
      type: Sequelize.TIME,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert NOT NULL constraints (based on original migration)
    await queryInterface.changeColumn('messages', 'receiver', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
    await queryInterface.changeColumn('messages', 'title', {
      type: Sequelize.STRING(255),
      allowNull: false,
    });
    await queryInterface.changeColumn('messages', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
    });
    await queryInterface.changeColumn('messages', 'date', {
      type: Sequelize.DATEONLY,
      allowNull: false,
    });
    await queryInterface.changeColumn('messages', 'time', {
      type: Sequelize.TIME,
      allowNull: false,
    });

    // Remove added columns
    await queryInterface.removeColumn('messages', 'message_time');
    await queryInterface.removeColumn('messages', 'message_date');
    await queryInterface.removeColumn('messages', 'seen');
    await queryInterface.removeColumn('messages', 'content');
  },
};
