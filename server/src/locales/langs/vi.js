const LocaleKey = require('../key.locale');

module.exports = {
  [LocaleKey.HEALTHY]: 'Đang chạy!',
  [LocaleKey.STH_WRONG]: 'Đã xảy ra lỗi, vui lòng thử lại sau!',
  [LocaleKey.UNAUTHORIZED]: 'Rất tiếc, bạn không có quyền cần thiết để truy cập tài nguyên này!',
  [LocaleKey.ACCOUNT_INCORRECT]: 'Email hoặc mật khẩu không chính xác!',
  [LocaleKey.ACCOUNT_ALREADY]: 'Tài khoản đã tồn tại!',
  [LocaleKey.PASSWORD_INVALID]: 'Mật khẩu không đạt yêu cầu!',
  [LocaleKey.PASSWORD_INCORRECT]: 'Mật khẩu không chính xác!',
  [LocaleKey.PASSWORD_RESET_SUCCESS]: 'Đặt lại mật khẩu thành công!',
  [LocaleKey.PASSWORD_CHANGE_SUCCESS]: 'Đổi mật khẩu thành công!',
  [LocaleKey.USERNAME_INVALID]: 'Tên người dùng không đạt yêu cầu!',
  [LocaleKey.POST_MEDIA_INVALID]:
    'Tệp phương tiện không hợp lệ. Chỉ hỗ trợ tệp .jfif, .pjpeg, .pjp, .jpeg, .jpg, .png, .heic, .mov, .mv4, .mp4!',
  [LocaleKey.AVATAR_INVALID]:
    'Tệp hình ảnh không hợp lệ. Chỉ hỗ trợ hình ảnh .jfif, .pjpeg, .pjp, .jpeg, .jpg, .png, .heic!',
  [LocaleKey.TOKEN_INVALID]: 'Token không hợp lệ!',
  [LocaleKey.TOKEN_EXPIRED]: 'Token đã hết hạn!',
  [LocaleKey.OTP_INVALID]: 'Mã OTP không hợp lệ!',
  [LocaleKey.OTP_EXPIRED]: 'Mã OTP đã hết hạn!',
  [LocaleKey.MAIL_SUCCESS]: (content) =>
    `Chúng tôi vừa gửi ${content} tới email của bạn. Hãy kiểm tra hòm thư!`,
  [LocaleKey.SELF_FOLLOW]: 'Không thể tự theo dõi bản thân!',
  [LocaleKey.SELF_UNFOLLOW]: 'Không thể tự hủy theo dõi bản thân!',
  [LocaleKey.NOTIFICATION_FOLLOW]: 'bắt đầu theo dõi bạn.',
  [LocaleKey.NOTIFICATION_LIKE_POST]: 'đã thích bài biết của bạn.',
  [LocaleKey.NOTIFICATION_LIKE_REPLY]: 'đã thích trả lời của bạn.',
  [LocaleKey.NOTIFICATION_NEW]: 'đã tạo bài viết mới.',
  [LocaleKey.NOTIFICATION_REPLY]: 'đã trả lời bạn.',
  [LocaleKey.NOTIFICATION_QUOTE]: 'đã trích dẫn bài viết của bạn.'
};
