const router = require("express").Router();

const { validate } = require("../../middlewares");
const { userValidation, postValidation } = require("../../validations");
const { userController, postController } = require("../../controllers");

router
  .get("/user/:userId", validate(userValidation.getById), userController.getById)
  .get(
    "/user/:userId/post",
    validate(postValidation.getByUserId),
    postController.getByUserId
  )
  .get("/post/:postId", validate(postValidation.getById), postController.getById);

module.exports = router;
