const { password } = require("./message.constant");

module.exports = {
  label: {
    user: {
      fullName: "Full name",
      email: "Email",
      username: "Username",
      password: "Password",
    },
    otp: "OTP",
  },
  username: {
    regex: /^[\w](?!.*?\.{2})[\w.]{1,28}[\w]$/,
    maxlength: 30,
  },
  password: {
    regex: /^(?=.*[0-9])(?=.*[A-Za-z])\S{8,}$/,
    minLength: 8,
  },
  otp: {
    length: 6,
    min: 100000,
    max: 999999,
    job: {
      register: "Register",
    },
  },
  mediaFileAllow: [
    ".jfif",
    ".pjpeg",
    ".pjp",
    ".jpeg",
    ".jpg",
    ".png",
    ".heic",
    ".mov",
    ".mv4",
    ".mp4",
  ],
};
