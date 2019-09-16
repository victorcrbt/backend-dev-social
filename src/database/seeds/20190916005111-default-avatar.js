module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'avatars',
      [
        {
          name: 'default.png',
          path: 'default.png',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('avatars', { id: 1 }, {});
  },
};
