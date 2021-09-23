const bcrypt = require(`bcryptjs`);
const salt = bcrypt.genSaltSync(10);

function hashPassword(password) {
  return bcrypt.hashSync(password, salt);
}

function comparePassword(input, password) {
  return bcrypt.compareSync(input, password);
}

module.exports = { hashPassword, comparePassword };
