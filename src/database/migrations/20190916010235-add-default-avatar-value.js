module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('users', 'avatar_id', {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('users', 'avatar_id', {
      type: Sequelize.INTEGER,
      defaultValue: null,
    });
  },
};
