module.exports = {
  healthy: "Healthy",
  sthWrong: "Something went wrong, please try again later!",
  responseStatus: {
    success: "SUCCESS",
    error: "ERROR",
  },
  unauthorized:
    "Sorry, you do not have the necessary permissions to access this resource!",
  password: {
    invalid: "Unsatisfactory password!",
    incorrect: "Incorrect password!",
  },
  image: {
    invalid: "Only support .png, jpg, .jpeg, .heic image!",
  },
  token: {
    invalid: "Invalid JWT token!",
    expired: "Expired JWT token!",
  },
  otp: {
    invalid: "Invalid OTP!",
    expired: "Expired OTP!",
  },
  mail: {
    success: (content) =>
      `We just have send ${content} to your email. Check it now!`,
  },
  required: (field) => `${field} is required!`,
  notFound: (field) => `${field} is not found!`,
};
