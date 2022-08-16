const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://spedata:MuvzH6712Hg@@localhost/via', {
  define: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },

  logging: false,
});

module.exports = sequelize;
