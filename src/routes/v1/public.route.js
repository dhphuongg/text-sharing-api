const router = require('express').Router();

const { validate } = require('../../middlewares');
const { userValidation, postValidation } = require('../../validations');
const { userController, postController } = require('../../controllers');

router
  .get('/user/search', validate(userValidation.search), userController.search)
  .get('/user/:userId', validate(userValidation.getById), userController.getById)
  .get('/user/:userId/followers', validate(userValidation.getById), userController.getFollowersById)
  .get('/user/:userId/following', validate(userValidation.getById), userController.getFollowingById)
  .get('/user/:userId/post', validate(postValidation.getByUserId), postController.getByUserId)
  .get('/post/search', validate(postValidation.searchByContent), postController.searchByContent)
  .get('/post/:postId', validate(postValidation.getById), postController.getById)
  .get('/post/:postId/likers', validate(postValidation.getById), postController.getLikerByPostId);

module.exports = router;
