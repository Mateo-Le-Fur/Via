const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://via:via@localhost/via', {
  define: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },

  logging: false,
});

module.exports = sequelize;
