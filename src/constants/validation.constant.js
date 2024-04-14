module.exports = {
  username: {
    regex: /^[\w](?!.*?\.{2})[\w.]{1,28}[\w]$/,
    maxlength: 30
  },
  password: {
    regex: /^(?=.*[0-9])(?=.*[A-Za-z])\S{8,}$/,
    minLength: 8
  },
  otp: {
    length: 6,
    min: 100000,
    max: 999999,
    job: {
      register: 'REGISTER',
      resetPassword: 'RESET_PASSWORD'
    }
  },
  bio: {
    maxLength: 500
  },
  maxContentLength: 500,
  birthday: {
    min: '1900-01-01',
    max: '2018-01-01'
  },
  avatar: {
    allow: ['.jfif', '.pjpeg', '.pjp', '.jpeg', '.jpg', '.png', '.heic'],
    maxSize: 10
  },
  post_media: {
    allow: ['.jfif', '.pjpeg', '.pjp', '.jpeg', '.jpg', '.png', '.heic', '.mov', '.mv4', '.mp4'],
    maxSize: 1024,
    maxFilesAllow: 5
  },
  fieldname: {
    avatar: 'avatar',
    post_media: 'post_media'
  },
  postType: {
    new: 'NEW',
    reply: 'REPLY',
    repost: 'REPOST'
  }
};
