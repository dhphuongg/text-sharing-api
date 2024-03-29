module.exports.authorize = require('./auth.middleware').authorize;
module.exports.authSocket = require('./auth.middleware').authSocket;
module.exports.error = require('./error.middleware');
module.exports.avtUpload = require('./uploadFile.middleware').avtUpload;
module.exports.postMediaUpload = require('./uploadFile.middleware').postMediaUpload;
module.exports.validate = require('./validate.middleware');
