const router = require("express").Router();

const { validate } = require("../../middlewares");
const { userValidation } = require("../../validations");
const { userController } = require("../../controllers");

router.get(
  "/user/:id",
  validate(userValidation.getById),
  userController.getById
);

module.exports = router;
