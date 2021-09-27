"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
      },
      full_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      birth_date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      gender: {
        allowNull: false,
        type: Sequelize.ENUM("male", "female"),
      },
      register_as: {
        type: Sequelize.STRING,
      },
      main_card_showoff: {
        type: Sequelize.STRING,
      },
      portfolio_link: {
        type: Sequelize.STRING,
      },
      social_media_link: {
        type: Sequelize.STRING,
      },
      is_premium: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Users");
  },
};
