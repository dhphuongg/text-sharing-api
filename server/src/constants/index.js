module.exports.messageConstant = require("./message.constant");
module.exports.constants = {
  mode: {
    development: "development",
    production: "production",
    test: "test",
  },
  passwordMinLength: 8,
  otpLength: 6,
  pageDefault: 1,
  limitDefault: 10,
  sortByDefault: "createdAt",
  bcryptSalt: 11,
  uploadDirectory: "uploads",
  role: {
    user: "USER",
    admin: "ADMIN",
  },
  tokenType: "Bearer",
  emptyString: "",
  imageFileAllowed: [".png", ".jpg", ".jpeg", ".heic"],
};
