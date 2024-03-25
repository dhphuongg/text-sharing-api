const { validationConstant } = require("../../constants");
const { postController } = require("../../controllers");
const { validate, upload } = require("../../middlewares");
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
    upload.array(
      validationConstant.fieldname.post_media,
      validationConstant.post_media.maxFilesAllow
    ),
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
