const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env") });
module.exports = {
  server: {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    name: process.env.APP_NAME,
  },
  jwt: {
    secret: process.env.SECRET,
    salt: process.env.SALT,
    accessExpMinutes: process.env.ACCESS_EXP_MINUTES,
    refressExpMinutes: process.env.REFRESH_EXP_MINUTES,
  },
  admin: {
    fullName: process.env.FULL_NAME,
    email: process.env.EMAIL,
    password: process.env.PASSWORD,
  },
  otp: {
    exp: process.env.OTP_EXP_MINUTES,
  },
  mail: {
    user: process.env.USER_MAIL,
    pass: process.env.PASS_MAIL,
  },
};
