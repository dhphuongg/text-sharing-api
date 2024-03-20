const { validationConstant } = require("../constants");

const otpGenerator = (
  min = validationConstant.otp.min,
  max = validationConstant.otp.max
) => ~~(Math.random() * (max - min)) + min;

const passwordGenerator = (length = validationConstant.password.minLength) => {
  const characters =
    "ABCDEFGHIJK0123456789LMNOPQRSTUVWXYZ0123456789abcdefghijklm0123456789nopqrstuvwxyz";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomPos = ~~(Math.random() * characters.length);
    password += characters.charAt(randomPos);
  }
  return password;
};

module.exports = { otpGenerator, passwordGenerator };
