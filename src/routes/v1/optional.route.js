const router = require('express').Router();

const { validate, authorize } = require('../../middlewares');
const { userValidation, postValidation } = require('../../validations');
const { userController, postController } = require('../../controllers');
const { constants } = require('../../constants');

router
  .get(
    '/user/search',
    authorize([constants.role.user]),
    validate(userValidation.search),
    userController.search
  )
  .get('/user/:username', validate(userValidation.getByUsername), userController.getByUsername)
  .get('/user/:userId/post', validate(postValidation.getByUserId), postController.getByUserId)
  .get('/post/liked', authorize([constants.role.user]), postController.getMyLikedPosts)
  .get(
    '/post/search',
    authorize([constants.role.user]),
    validate(postValidation.searchByContent),
    postController.searchByContent
  )
  .get('/post/:postId', validate(postValidation.getById), postController.getById)
  .get(
    '/post/:postId/reply',
    validate(postValidation.getRepliesById),
    postController.getRepliesById
  );

module.exports = router;
