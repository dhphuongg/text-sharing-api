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
  .delete("/:id", validate(postValidation.getById), postController.deleteById);

module.exports = router;
