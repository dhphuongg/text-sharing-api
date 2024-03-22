const router = require("express").Router();

const { validate, upload } = require("../../middlewares");
const { userValidation } = require("../../validations");
const { userController } = require("../../controllers");
const { validationConstant } = require("../../constants");

router
  .get("/:id", validate(userValidation.getById), userController.getById)
  .get("/", userController.getProfile)
  .patch(
    "/",
    upload.single(validationConstant.fieldname.avatar),
    validate(userValidation.updateUser),
    userController.updateProfile
  )
  .patch(
    "/change-password",
    validate(userValidation.changePassword),
    userController.changePassword
  );

module.exports = router;
