const router = require("express").Router();

const validate = require("../../middlewares/validate");
const { userValidation } = require("../../validations");
const { userController } = require("../../controllers");

router.post(
  "/change-password",
  validate(userValidation.changePassword),
  userController.changePassword
);

module.exports = router;
