function errorHandler(err, req, res, next) {
  let code;
  let message;

  console.log(err.name, "this is the error name");

  switch (err.name) {
    case "Username/Password Incorrect":
      code = 401;
      message = "Username/Password Incorrect";
      break;

    case "SequelizeUniqueConstraintError":
      code = 400;
      message = "Email must be unique";
      break;

    case "JsonWebTokenError":
      code = 401;
      message = "Authentication Failed";
      break;

    case "Authentication Failed":
      code = 401;
      message = "Authentication Failed";
      break;

    case "Authorization Failed":
      code = 401;
      message = "Authorization Failed";
      break;

    default:
      code = 500;
      message = "Internal Server Error";
      break;
  }
  res.status(code).json({ message, errDev: err });
}

module.exports = { errorHandler };
