const router = require('express').Router();

const optionalRoute = require('./optional.route');
const authRouter = require('./auth.route');
const userRouter = require('./user.route');
const postRouter = require('./post.route');
const notificationRouter = require('./notification.route');
const { authorize, optionalAuth } = require('../../middlewares');
const { constants } = require('../../constants');

router.use('/public', optionalAuth, optionalRoute);
router.use('/auth', authRouter);
router.use('/user', authorize([constants.role.user]), userRouter);
router.use('/post', authorize([constants.role.user]), postRouter);
router.use('/notification', authorize([constants.role.user]), notificationRouter);

module.exports = router;
