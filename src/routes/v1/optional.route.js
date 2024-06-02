const router = require('express').Router();

const { validate } = require('../../middlewares');
const { userValidation, postValidation } = require('../../validations');
const { userController, postController } = require('../../controllers');

router
  .get('/user/:username', validate(userValidation.getByUsername), userController.getByUsername)
  .get(
    '/user/:username/post',
    validate(userValidation.getByUsername),
    postController.getNewByUsername
  )
  .get(
    '/user/:username/replies',
    validate(userValidation.getByUsername),
    postController.getRepliesByUsername
  )
  .get(
    '/user/:username/reposts',
    validate(userValidation.getByUsername),
    postController.getRepostsByUsername
  )
  .get('/post/:postId', validate(postValidation.getById), postController.getById)
  .get(
    '/post/:postId/reply',
    validate(postValidation.getRepliesById),
    postController.getRepliesByPostId
  );

module.exports = router;
