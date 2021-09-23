var jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET_KEY;
// const SECRET_KEY = "Anjing"

function generateToken(payload) {
  return jwt.sign(payload, SECRET_KEY);
}

function verifyToken(token) {
  return jwt.verify(token, SECRET_KEY);
}

module.exports = { generateToken, verifyToken };
