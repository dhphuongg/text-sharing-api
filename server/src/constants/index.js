module.exports.messageConstant = require("./message.constant");
module.exports.validationConstant = require("./validation.constant");
module.exports.constants = {
  message: this.messageConstant,
  validation: this.validationConstant,
  app: {
    name: "HIT Circle",
  },
  mode: {
    development: "development",
    production: "production",
    test: "test",
  },
  pageDefault: 1,
  limitDefault: 10,
  sortByDefault: "createdAt",
  bcryptSalt: 11,
  uploadDirectory: "uploads",
  role: {
    user: "USER",
    admin: "ADMIN",
  },
  tokenType: {
    access: "access",
    refresh: "refresh",
  },
  emptyString: "",
};
