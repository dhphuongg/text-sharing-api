const router = require('express').Router();

const { validate } = require('../../middlewares');
const { userValidation, postValidation } = require('../../validations');
const { userController, postController } = require('../../controllers');

router
  .get('/user/search', validate(userValidation.search), userController.search)
  .get('/user/:username', validate(userValidation.getByUsername), userController.getByUsername)
  .get('/user/:userId/post', validate(postValidation.getByUserId), postController.getByUserId)
  .get('/post/search', validate(postValidation.searchByContent), postController.searchByContent)
  .get('/post/:postId', validate(postValidation.getById), postController.getById)
  .get(
    '/post/:postId/reply',
    validate(postValidation.getRepliesById),
    postController.getRepliesById
  );

module.exports = router;
