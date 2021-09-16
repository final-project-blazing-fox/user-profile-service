const { User } = require(`../models/index`);

class UserController {
  static getUsers(req, res) {
    User.findAll()
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findUser(req, res) {
    User.findByPk(req.params.id)
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static createUser(req, res) {
    const {
      email,
      password,
      full_name,
      register_as,
      main_card_showoff,
      is_premium,
    } = req.body;
    User.create({
      email,
      password,
      full_name,
      register_as,
      main_card_showoff,
      is_premium,
    })
      .then((data) => {
        res.status(200).json(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = UserController;
