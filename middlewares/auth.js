const e = require("express");
const { verifyToken } = require("../helpers/jwt");
const { User } = require("../models/index");

function authentication(req, res, next) {
  // let decoded = verifyToken(req.headers.access_token);
  // if (decoded.isAdmin) {
  //   req.currentUser = {
  //     isAdmin: true,
  //   };
  //   next();
  // } else {
  //   User.findByPk(decoded.id)
  //     .then((data) => {
  //       if (!data) {
  //         throw { name: "Authentication Failed" };
  //       } else {
  //         req.currentUser = {
  //           id: data.id,
  //           full_name: data.full_name,
  //           email: data.email,
  //           is_premium: data.is_premium,
  //         };
  //         console.log(req.currentUser, "From Authentication");
  //         next();
  //       }
  //     })
  //     .catch(next)
  //   }
  try {
    let decoded = verifyToken(req.headers.access_token);
    if (decoded.isAdmin) {
      req.currentUser = {
        isAdmin: true,
      };
      next();
    } else {
      User.findByPk(decoded.id)
        .then((data) => {
          if (!data) {
            throw { name: "Authentication Failed" };
          } else {
            req.currentUser = {
              id: data.id,
              full_name: data.full_name,
              email: data.email,
              is_premium: data.is_premium,
            };
            console.log(req.currentUser, "From Authentication");
            next();
          }
        })
        .catch(next);
    }
  } catch (error) {
    next(error);
  }
}

function authorization(req, res, next) {
  console.log(req.currentUser, "From Authorization");
  if (req.currentUser.isAdmin) {
    next();
  } else {
    User.findByPk(req.params.id)
      .then((data) => {
        if (!data) {
          throw { name: "User Not Found!" };
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
}

module.exports = { authentication, authorization };
