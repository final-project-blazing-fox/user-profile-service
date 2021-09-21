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
      is_premium,
    })
      .then((data) => {
        res
          .status(201)
          .json({
            email: data.email,
            full_name: data.full_name,
            birth_date: data.birth_date,
            gender: data.gender,
            register_as: data.register_as,
            main_card_showoff: data.main_card_showoff,
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
            res.status(200).json({ access_token: token });
          }
        }
      })
      .catch(next);
  }

  static getUsers(req, res, next) {
    console.log(req.currentUser);
    User.findAll({ attributes: ["id", "email", "is_premium"] })
      .then((data) => {
        res.status(200).json(data);
      })
      .catch(next);
  }

  static findUser(req, res, next) {
    // console.log(req.params.id);
    User.findByPk(req.params.id, {
      attributes: [
        "email",
        "is_premium",
        "full_name",
        "birth_date",
        "gender",
        "register_as",
        "main_card_showoff",
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
    const { password, full_name, register_as, main_card_showoff, is_premium } =
      req.body;
    User.findByPk(req.params.id)
      .then((data) => {
        if (!data) {
          throw { name: "User not Found" };
        } else {
          return data.update({
            password,
            full_name,
            register_as,
            main_card_showoff,
            is_premium,
          });
        }
      })
      .then((data) => {
        res.status(200).json({ email: data.email, updated: data.updatedAt });
      })
      .catch(next);
  }

  static deleteUser(req, res, next) {
    console.log(req.params.id, "params");
    console.log(req.currentUser.id, "current");
    let deletedData = {};
    User.findByPk(req.params.id, {
      attributes: [
        "email",
        "is_premium",
        "full_name",
        "birth_date",
        "gender",
        "register_as",
        "main_card_showoff",
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
        res.status(200).json(deletedData);
      })
      .catch((err) => {
        console.log("data ga ktemu");
        next(err);
      });
  }
}

module.exports = UserController;
