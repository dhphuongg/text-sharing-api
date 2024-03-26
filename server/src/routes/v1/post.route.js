const { postController } = require("../../controllers");
const { validate, postMediaUpload } = require("../../middlewares");
const { postValidation } = require("../../validations");

const router = require("express").Router();

router
  .get("/liked", postController.getPostByLiker)
  .get("/:postId", validate(postValidation.getById), postController.getById)
  .get(
    "/:postId/replies",
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
    "/:postId",
    validate(postValidation.editContentByID),
    postController.editContentById
  )
  .delete(
    "/:postId",
    validate(postValidation.getById),
    postController.deleteById
  )
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
