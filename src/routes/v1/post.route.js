const { postController } = require('../../controllers');
const { validate, postMediaUpload } = require('../../middlewares');
const { postValidation } = require('../../validations');

const router = require('express').Router();

router
  .get('/liked', postController.getMyLikedPosts)
  .get('/search', validate(postValidation.searchByContent), postController.searchByContent)
  .post(
    '/:postId/reply',
    postMediaUpload,
    validate(postValidation.createReplyPost),
    postController.createReplyPost
  )
  .get('/:postId/likers', validate(postValidation.getById), postController.getLikerByPostId)
  .post('/', postMediaUpload, validate(postValidation.createNewPost), postController.createNewPost)
  .patch('/:postId', validate(postValidation.editContentByID), postController.editContentById)
  .delete('/:postId', validate(postValidation.getById), postController.deleteById)
  .post('/:postId/like', validate(postValidation.likePost), postController.likePostById)
  .delete('/:postId/like', validate(postValidation.likePost), postController.unlikePostById);

module.exports = router;
