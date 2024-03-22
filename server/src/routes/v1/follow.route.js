const router = require("express").Router();

const { followController } = require("../../controllers");
const { validate } = require("../../middlewares");
const { followValidation } = require("../../validations");

router
  .post("/", validate(followValidation.follow), followController.follow)
  .delete("/", validate(followValidation.follow), followController.unfollow);

module.exports = router;
