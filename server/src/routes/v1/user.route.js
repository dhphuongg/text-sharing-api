const router = require("express").Router();

const { auth, validate, upload } = require("../../middlewares");
const { userValidation } = require("../../validations");
const { userController } = require("../../controllers");
const { validationConstant, constants } = require("../../constants");

router
  .patch(
    "/",
    auth([constants.role.user]),
    upload.single(validationConstant.fieldname.avatar),
    validate(userValidation.updateUser),
    userController.updateProfile
  )
  .patch(
    "/change-password",
    auth([constants.role.user]),
    validate(userValidation.changePassword),
    userController.changePassword
  );

module.exports = router;
