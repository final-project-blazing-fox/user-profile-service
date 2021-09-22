const { User } = require(`../models/index`);
const { comparePassword } = require("../helpers/bcrypt");
const { generateToken } = require("../helpers/jwt");

class UserController {
  static createUser(req, res, next) {
    const {
      email,
      password,
      full_name,
      birth_date,
      gender,
      register_as,
      main_card_showoff,
      social_media_link,
      portfolio_link,
      is_premium,
    } = req.body;
    User.create({
      email,
      password,
      full_name,
      birth_date,
      gender,
      register_as,
      main_card_showoff,
      social_media_link,
      portfolio_link,
      is_premium,
    })
      .then((data) => {
        res.status(201).json({
          message: "User successfully created!",
          email: data.email,
          full_name: data.full_name,
          birth_date: data.birth_date,
          gender: data.gender,
          register_as: data.register_as,
          main_card_showoff: data.main_card_showoff,
          social_media_link: data.social_media_link,
          portfolio_link: data.portfolio_link,
          is_premium: data.is_premium,
        });
      })
      .catch(next);
  }

  static login(req, res, next) {
    const { email, password } = req.body;
    User.findOne({ where: { email } })
      .then((data) => {
        if (!data) {
          throw { name: "Username/Password Incorrect" };
        } else {
          if (!comparePassword(password, data.password)) {
            throw { name: "Username/Password Incorrect" };
          } else {
            let token = generateToken({
              id: data.id,
              full_name: data.full_name,
              email: data.email,
              is_premium: data.is_premium,
            });
            let adminToken = generateToken({
              isAdmin: true,
            });
            console.log(adminToken);
            res.status(200).json({ access_token: token });
          }
        }
      })
      .catch(next);
  }

  static getUsers(req, res, next) {
    console.log(req.currentUser);
    User.findAll({
      attributes: [
        "id",
        "full_name",
        "email",
        "gender",
        "birth_date",
        "register_as",
        "main_card_showoff",
        "social_media_link",
        "portfolio_link",
        "is_premium",
      ],
    })
      .then((data) => {
        res.status(200).json(data);
      })
      .catch(next);
  }

  static findUser(req, res, next) {
    User.findByPk(req.params.id, {
      attributes: [
        "full_name",
        "email",
        "gender",
        "birth_date",
        "register_as",
        "main_card_showoff",
        "social_media_link",
        "portfolio_link",
        "is_premium",
      ],
    })
      .then((data) => {
        if (!data) {
          throw { name: "User not Found" };
        } else {
          res.status(200).json(data);
        }
      })
      .catch(next);
  }

  static patchUser(req, res, next) {
    const {
      password,
      full_name,
      birth_date,
      gender,
      register_as,
      main_card_showoff,
      social_media_link,
      portfolio_link,
    } = req.body;
    User.findByPk(req.params.id)
      .then((data) => {
        if (!data) {
          throw { name: "User not Found" };
        } else {
          return data.update({
            password,
            full_name,
            birth_date,
            gender,
            register_as,
            main_card_showoff,
            social_media_link,
            portfolio_link,
          });
        }
      })
      .then((data) => {
        res
          .status(200)
          .json({
            message: `User with id ${req.params.id} successfully modified`,
            email: data.email,
            updated: data.updatedAt,
          });
      })
      .catch(next);
  }

  static deleteUser(req, res, next) {
    // console.log(req.params.id, "params");
    // console.log(req.currentUser.id, "current");
    let deletedData = {};
    User.findByPk(req.params.id, {
      attributes: [
        "full_name",
        "email",
        "gender",
        "birth_date",
        "register_as",
        "main_card_showoff",
        "social_media_link",
        "portfolio_link",
        "is_premium",
      ],
    })
      .then((data) => {
        if (!data) {
          throw { name: "Delete Unsuccessful" };
        } else {
          deletedData = data;
          return User.destroy({ where: { id: req.params.id } });
        }
      })
      .then((data) => {
        deletedData.message = `User with id ${req.params.id} successfully deleted!`;
        res
          .status(200)
          .json({
            deletedData,
            message: `User with id ${req.params.id} successfully deleted!`,
          });
      })
      .catch((err) => {
        next(err);
      });
  }

  static upgradeUser(req, res, next) {
    try {
      if (req.currentUser.isAdmin) {
        User.findByPk(req.params.id)
          .then((data) => {
            if (!data) {
              throw { name: "User not Found" };
            } else {
              return data.update({
                is_premium: true,
              });
            }
          })
          .then((data) => {
            res
              .status(200)
              .json({
                message: `User with id ${req.params.id} successfully upgraded`,
                full_name: data.full_name,
                email: data.email,
                updated: data.updatedAt,
              });
          })
          .catch(next);
      } else {
        throw { name: "Only admin can change membership status" };
      }
    } catch (error) {
      next(error);
    }
  }

  static downgradeUser(req, res, next) {
    try {
      if (req.currentUser.isAdmin) {
        User.findByPk(req.params.id)
          .then((data) => {
            if (!data) {
              throw { name: "User not Found" };
            } else {
              return data.update({
                is_premium: false,
              });
            }
          })
          .then((data) => {
            res
              .status(200)
              .json({
                message: `User with id ${req.params.id} successfully downgraded`,
                full_name: data.full_name,
                email: data.email,
                updated: data.updatedAt,
              });
          })
          .catch(next);
      } else {
        throw { name: "Only admin can change membership status" };
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
