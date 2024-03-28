const router = require("express").Router();

const { validate, avtUpload } = require("../../middlewares");
const { userValidation, postValidation } = require("../../validations");
const { userController, postController } = require("../../controllers");

router
  .get("/search", userController.search)
  .get("/:userId", validate(userValidation.getById), userController.getById)
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
  .post(
    "/:userId/follow",
    validate(userValidation.getById),
    userController.follow
  )
  .delete(
    "/:userId/follow",
    validate(userValidation.getById),
    userController.unfollow
  )
  .get(
    "/:userId/followers",
    validate(userValidation.getById),
    userController.getFollowersById
  )
  .get(
    "/:userId/following",
    validate(userValidation.getById),
    userController.getFollowingById
  );

module.exports = router;
