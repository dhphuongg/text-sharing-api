module.exports.validationConstant = require('./validation.constant');
module.exports.constants = {
  app: {
    name: 'HIT Circle'
  },
  mode: {
    development: 'development',
    production: 'production',
    test: 'test'
  },
  pageDefault: 1,
  limitDefault: 10,
  sortByDefault: 'createdAt',
  bcryptSalt: 11,
  uploadDirectory: 'uploads',
  role: {
    user: 'USER',
    admin: 'ADMIN'
  },
  tokenType: {
    access: 'access',
    refresh: 'refresh'
  },
  emptyString: '',
  message: {
    success: 'SUCCESS',
    error: 'ERROR'
  },
  event: {
    follow: 'FOLLOW',
    likePost: 'LIKE_POST',
    likeReply: 'LIKE_REPLY',
    new: 'NEW',
    reply: 'REPLY',
    repost: 'REPOST'
  }
};
