const { validationConstant } = require("../../constants");
const { postController } = require("../../controllers");
const { validate, upload } = require("../../middlewares");
const { postValidation } = require("../../validations");

const router = require("express").Router();

router
  .get("/:id", postController.getById)
  .post(
    "/",
    upload.array(
      validationConstant.fieldname.post_media,
      validationConstant.post_media.maxFilesAllow
    ),
    validate(postValidation.createNewPost),
    postController.createNewPost
  );

module.exports = router;
