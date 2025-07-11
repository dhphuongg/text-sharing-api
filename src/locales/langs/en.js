const LocaleKey = require('../key.locale');

module.exports = {
  [LocaleKey.HEALTHY]: 'Healthy!',
  [LocaleKey.STH_WRONG]: 'Something went wrong, please try again later!',
  [LocaleKey.UNAUTHORIZED]:
    'Sorry, you do not have the necessary permissions to access this resource!',
  [LocaleKey.ACCOUNT_INCORRECT]: 'Email or password is incorrect',
  [LocaleKey.ACCOUNT_ALREADY]: 'Email address is already!',
  [LocaleKey.PASSWORD_INVALID]: 'Unsatisfactory password!',
  [LocaleKey.PASSWORD_INCORRECT]: 'Incorrect password!',
  [LocaleKey.PASSWORD_RESET_SUCCESS]: 'Reset password successful!',
  [LocaleKey.PASSWORD_CHANGE_SUCCESS]: 'Change password successful!',
  [LocaleKey.USERNAME_INVALID]: 'Unsatisfactory username!',
  [LocaleKey.POST_MEDIA_INVALID]:
    'Invalid media file. Only support .jfif, .pjpeg, .pjp, .jpeg, .jpg, .png, .heic, .mov, .mv4, .mp4 file!',
  [LocaleKey.AVATAR_INVALID]:
    'Invalid image file. Only support .jfif, .pjpeg, .pjp, .jpeg, .jpg, .png, .heic image!',
  [LocaleKey.TOKEN_INVALID]: 'Invalid JWT token!',
  [LocaleKey.TOKEN_EXPIRED]: 'Expired JWT token!',
  [LocaleKey.OTP_INVALID]: 'Invalid OTP!',
  [LocaleKey.OTP_EXPIRED]: 'Expired OTP!',
  [LocaleKey.MAIL_SUCCESS]: 'We just have send %s to your email. Check it now!',
  [LocaleKey.FOLLOW_ALREADY]: "You're already following this person!",
  [LocaleKey.FOLLOW_SUCCESS]: 'Follow successful!',
  [LocaleKey.UNFOLLOW_SUCCESS]: 'Unfollow successful!',
  [LocaleKey.UNFOLLOW_FAILED]: 'Unfollow failed!',
  [LocaleKey.SELF_FOLLOW]: 'Can not self-follow!',
  [LocaleKey.SELF_UNFOLLOW]: 'Can not self-unfollow!',
  [LocaleKey.LIKE_SUCCESS]: 'Like successful!',
  [LocaleKey.UNLIKE_SUCCESS]: 'Unlike successful!',
  [LocaleKey.NOTIFICATION_FOLLOW]: 'started following you.',
  [LocaleKey.NOTIFICATION_LIKE_POST]: 'liked your post.',
  [LocaleKey.NOTIFICATION_LIKE_REPLY]: 'liked your reply.',
  [LocaleKey.NOTIFICATION_NEW]: 'created new post.',
  [LocaleKey.NOTIFICATION_REPLY]: 'reply you.',
  [LocaleKey.NOTIFICATION_REPOST]: 'shared your post.',
  [LocaleKey.NOT_FOUND]: '%s is not found!',
  [LocaleKey.REQUIRED]: '%s is required!',
  [LocaleKey.ALREADY]: '%s is already!',
  [LocaleKey.USER]: 'User',
  [LocaleKey.POST]: 'Post',
  [LocaleKey.FOLLOW]: 'Follow'
};
