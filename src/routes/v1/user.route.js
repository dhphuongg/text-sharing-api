const router = require('express').Router();

const { validate, avtUpload } = require('../../middlewares');
const { userValidation } = require('../../validations');
const { userController } = require('../../controllers');

router
  .get('/', userController.getProfile)
  .patch('/', avtUpload, validate(userValidation.updateUser), userController.updateProfile)
  .patch('/change-password', validate(userValidation.changePassword), userController.changePassword)
  .get('/search', validate(userValidation.search), userController.search)
  .post('/:userId/follow', validate(userValidation.getById), userController.follow)
  .delete('/:userId/follow', validate(userValidation.getById), userController.unfollow)
  .get('/:userId/followers', validate(userValidation.getById), userController.getFollowersById)
  .get('/:userId/following', validate(userValidation.getById), userController.getFollowingById);

module.exports = router;
