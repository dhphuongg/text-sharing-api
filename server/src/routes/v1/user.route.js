const router = require("express").Router();

const validate = require("../../middlewares/validate");
const { userValidation } = require("../../validations");
const { userController } = require("../../controllers");
const { validationConstant } = require("../../constants");
const upload = require("../../middlewares/uploadFile");

router
  .post(
    "/",
    upload.single(validationConstant.fieldname.avatar),
    validate(userValidation.updateUser),
    userController.updateProfile
  )
  .post(
    "/change-password",
    validate(userValidation.changePassword),
    userController.changePassword
  );

module.exports = router;
