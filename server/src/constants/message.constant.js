const validationConstant = require('./validation.constant');

module.exports = {
  healthy: 'Healthy',
  sthWrong: 'Something went wrong, please try again later!',
  responseStatus: {
    success: 'SUCCESS',
    error: 'ERROR'
  },
  unauthorized: 'Sorry, you do not have the necessary permissions to access this resource!',
  account: {
    incorrect: 'Email or password is incorrect!',
    already: 'Email address is already!'
  },
  password: {
    invalid: 'Unsatisfactory password!',
    incorrect: 'Incorrect password!',
    resetSuccess: 'Reset password successful!',
    changeSuccess: 'Change password successfull!'
  },
  username: {
    invalid: 'Unsatisfactory username!'
  },
  post_media: {
    invalid:
      'Invalid media file. Only support .jfif, .pjpeg, .pjp, .jpeg, .jpg, .png, .heic, .mov, .mv4, .mp4 file!'
  },
  avatar: {
    invalid: 'Invalid image file. Only support .jfif, .pjpeg, .pjp, .jpeg, .jpg, .png, .heic image!'
  },
  token: {
    invalid: 'Invalid JWT token!',
    expired: 'Expired JWT token!'
  },
  otp: {
    invalid: 'Invalid OTP!',
    expired: 'Expired OTP!'
  },
  mail: {
    success: (content) => `We just have send ${content} to your email. Check it now!`
  },
  follow: {
    selfFollow: 'Can not self-follow!',
    selfUnfollow: 'Can not self-unfollow!'
  },
  database: {
    type: 'MySQL',
    connectSuccess: '✅ MySQL Database is connected',
    connectFail: '❌ Connect to MySQL Database is failed'
  },
  notifyContent: {
    [validationConstant.event.follow]: 'started following you.',
    [validationConstant.event.likePost]: 'liked your post.',
    [validationConstant.event.likeReply]: 'liked your reply.',
    [validationConstant.event.new]: 'created new post.',
    [validationConstant.event.reply]: 'reply your post.',
    [validationConstant.event.quote]: 'quote your post.'
  },
  required: (field) => `${field} is required!`,
  notFound: (field) => `${field} is not found!`,
  already: (field) => `${field} is already!`
};
