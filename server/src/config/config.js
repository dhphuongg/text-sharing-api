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
    accessExpMinutes: process.env.ACCESS_EXP_MINUTES,
    refressExpMinutes: process.env.REFRESH_EXP_MINUTES
  },
  admin: {
    fullName: process.env.ADMIN_FULL_NAME,
    email: process.env.ADMIN_EMAIL,
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD
  },
  otp: {
    exp: process.env.OTP_EXP_MINUTES
  },
  mail: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
  }
};
