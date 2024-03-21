const jwt = require("jsonwebtoken");

const config = require("../config/config");
const { constants } = require("../constants");

const generateToken = (sub, type) => {
  const exp =
    type === constants.tokenType.access
      ? config.jwt.accessExpMinutes
      : config.jwt.refressExpMinutes;
  return jwt.sign({ sub }, config.jwt.secret, { expiresIn: `${exp}m` });
};

const verifyToken = (token) => {
  const decode = jwt.verify(token, config.jwt.secret);
  return decode;
};

module.exports = { generateToken, verifyToken };
