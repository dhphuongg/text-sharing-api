module.exports.authorize = require("./auth.middleware");
module.exports.error = require("./error.middleware");
module.exports.avtUpload = require("./uploadFile.middleware").avtUpload;
module.exports.postMediaUpload =
  require("./uploadFile.middleware").postMediaUpload;
module.exports.validate = require("./validate.middleware");
