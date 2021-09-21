"use strict";

const user = require("./userSeeds.json");
user.forEach((user) => {
  user.createdAt = new Date();
  user.updatedAt = new Date();
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Users", user, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
