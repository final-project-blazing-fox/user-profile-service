"use strict";
const { hashPassword } = require("../helpers/bcrypt");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      full_name: DataTypes.STRING,
      birth_date: DataTypes.DATE,
      gender: DataTypes.ENUM("male", "female"),
      register_as: DataTypes.STRING,
      main_card_showoff: DataTypes.STRING,
      portfolio_link: DataTypes.STRING,
      social_media_link: DataTypes.STRING,
      is_premium: DataTypes.BOOLEAN,
    },
    {
      hooks: {
        beforeCreate: (instance, options) => {
          instance.password = hashPassword(instance.password);

          let fixName = instance.full_name.toLowerCase().split(" ");
          for (let i = 0; i < fixName.length; i++) {
            fixName[i] =
              fixName[i].charAt(0).toUpperCase() + fixName[i].substring(1);
          }

          instance.full_name = fixName.join(" ");
        },
        beforeUpdate: (instance, options) => {
          instance.password = hashPassword(instance.password);

          let fixName = instance.full_name.toLowerCase().split(" ");
          for (let i = 0; i < fixName.length; i++) {
            fixName[i] =
              fixName[i].charAt(0).toUpperCase() + fixName[i].substring(1);
          }

          instance.full_name = fixName.join(" ");
        },
      },
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
