const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models/index");

function authentication(req, res, next) {
  try {
    let decoded = verifyToken(req.headers.access_token);
    User.findByPk(decoded.id).then((data) => {
      if (!data) {
        throw { name: "Authentication Failed" };
      } else {
        req.currentUser = {
          id: data.id,
          full_name: data.full_name,
          email: data.email,
          is_premium: data.is_premium,
        };
        next();
      }
    });
  } catch (error) {
    throw { name: "Authentcation failed" };
  }
}

function authorization(req, res, next) {
  User.findByPk(req.params.id)
    .then((data) => {
      if (!data) {
        throw { name: "User not found!" };
      } else {
        if (req.currentUser.id !== data.id) {
          throw { name: "Authorization Failed!" };
        } else {
          next();
        }
      }
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = { authentication, authorization };
