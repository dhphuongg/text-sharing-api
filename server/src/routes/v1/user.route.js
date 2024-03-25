const router = require("express").Router();

const { validate, avtUpload } = require("../../middlewares");
const { userValidation, postValidation } = require("../../validations");
const { userController, postController } = require("../../controllers");

router
  .get("/:id", validate(userValidation.getById), userController.getById)
  .get(
    "/:userId/post",
    validate(postValidation.getByUserId),
    postController.getByUserId
  )
  .get("/", userController.getProfile)
  .patch(
    "/",
    avtUpload,
    validate(userValidation.updateUser),
    userController.updateProfile
  )
  .patch(
    "/change-password",
    validate(userValidation.changePassword),
    userController.changePassword
  )
  .get(
    "/:id/followers",
    validate(userValidation.getById),
    userController.getFollowersById
  )
  .get(
    "/:id/following",
    validate(userValidation.getById),
    userController.getFollowingById
  );

module.exports = router;
