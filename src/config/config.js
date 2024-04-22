const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });
module.exports = {
  server: {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    name: process.env.APP_NAME
  },
  jwt: {
    secret: process.env.SECRET,
    salt: process.env.SALT,
    accessExpMinutes: process.env.ACCESS_EXP_MIN,
    refressExpMinutes: process.env.REFRESH_EXP_MIN
  },
  otp: {
    exp: process.env.OTP_EXP_MIN
  },
  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD
  }
};
