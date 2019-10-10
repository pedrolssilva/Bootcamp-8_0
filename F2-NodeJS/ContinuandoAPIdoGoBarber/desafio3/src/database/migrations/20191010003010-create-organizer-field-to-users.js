module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('users', 'organizer', {
      type: Sequelize.BOOLEAN,
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: false,
      defaultValue: false,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('users', 'organizer');
  },
};
