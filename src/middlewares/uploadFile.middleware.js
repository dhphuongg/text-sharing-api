const path = require('path');
const multer = require('multer');
const crypto = require('crypto');

const { constants, validationConstant } = require('../constants');
const LocaleKey = require('../locales/key.locale');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = path.join(constants.uploadDirectory, validationConstant.fieldname[file.fieldname]);
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = crypto.randomBytes(20).toString('hex') + ext;
    cb(null, `${req.body.email || req.auth.email}-${file.fieldname}-${uniqueSuffix}`);
  }
});

const avtUpload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    if (!validationConstant[file.fieldname].allow.includes(ext)) {
      return cb(new Error(_t(LocaleKey.AVATAR_INVALID)));
    }
    cb(null, true);
  },
  limits: { fileSize: 1024 * 1024 * validationConstant.avatar.maxSize }
});

const postMediaUpload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    if (!validationConstant[file.fieldname].allow.includes(ext)) {
      return cb(new Error(_t(LocaleKey.POST_MEDIA_INVALID)));
    }
    cb(null, true);
  },
  limits: { fileSize: 1024 * 1024 * validationConstant.post_media.maxSize }
});

module.exports = {
  avtUpload: avtUpload.single(validationConstant.fieldname.avatar),
  postMediaUpload: postMediaUpload.array(
    validationConstant.fieldname.post_media,
    validationConstant.post_media.maxFilesAllow
  )
};
