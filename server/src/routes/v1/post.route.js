const { postController } = require("../../controllers");
const { validate, postMediaUpload } = require("../../middlewares");
const { postValidation } = require("../../validations");

const router = require("express").Router();

router
  .get("/:id", validate(postValidation.getById), postController.getById)
  .get(
    "/:id/replies",
    validate(postValidation.getRepliesById),
    postController.getRepliesById
  )
  .get(
    "/user/:userId",
    validate(postValidation.getByUserId),
    postController.getByUserId
  )
  .post(
    "/",
    postMediaUpload,
    validate(postValidation.createNewPost),
    postController.createNewPost
  )
  .patch(
    "/:id",
    validate(postValidation.editContentByID),
    postController.editContentById
  )
  .delete("/:id", validate(postValidation.getById), postController.deleteById)
  .post(
    "/:postId/like",
    validate(postValidation.likePost),
    postController.likePostById
  )
  .delete(
    "/:postId/like",
    validate(postValidation.likePost),
    postController.unlikePostById
  );

module.exports = router;
