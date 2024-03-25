const router = require("express").Router();

const { validate } = require("../../middlewares");
const { userValidation, postValidation } = require("../../validations");
const { userController, postController } = require("../../controllers");

router
  .get("/user/:id", validate(userValidation.getById), userController.getById)
  .get("/post/:id", validate(postValidation.getById), postController.getById);

module.exports = router;
