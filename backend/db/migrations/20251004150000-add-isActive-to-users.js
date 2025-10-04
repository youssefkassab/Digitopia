module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'isActive', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      comment: 'User active status'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'isActive');
  },
};
