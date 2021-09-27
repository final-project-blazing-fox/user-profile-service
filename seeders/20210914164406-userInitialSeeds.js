"use strict";
const { hashPassword } = require("../helpers/bcrypt");

const user = require("./userSeeds.json");
user.forEach((user) => {
  user.password = hashPassword(user.password);
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
