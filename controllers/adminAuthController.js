const AdminUser = require("../models/adminAuth");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/adminjwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
// Register a new user   =>   /api/v1/user/register
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, username, password, role } = req.body;

  console.log(req.body);

  const user = await AdminUser.create({
    name,
    username,
    password,
    role,
  });

  sendToken(user, 200, res);
});

// Login user  =>  /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  console.log(req.cookies);
  const { username, password } = req.body;

  // Checks if email or password is entered by user
  if (!username || !password) {
    return next(new ErrorHandler("Please enter username & Password"), 400);
  }

  // Finding user in database
  const user = await AdminUser.findOne({ username }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid Email or Password.", 401));
  }

  // Check if password is correct
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }

  sendToken(user, 200, res);
});

// Forgot Password  =>  /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await AdminUser.findOne({ email: req.body.email });

  // Check user email is database
  if (!user) {
    return next(new ErrorHandler("No user found with this email.", 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset password url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset link is as follow:\n\n${resetUrl}\n\n If you have not request this, then please ignore that.`;

//   try {
//     await sendEmail({
//       email: user.email,
//       subject: "Express Gh Password Recovery",
//       message,
//     });

//     res.status(200).json({
//       success: true,
//       message: `Email sent successfully to: ${user.email}`,
//       link: resetUrl,
//     });
//   } catch (error) {
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;

//     await user.save({ validateBeforeSave: false });

//     return next(new ErrorHandler("Email is not sent."), 500);
//   }
});

// Reset Password   =>   /api/v1/password/reset/:token

exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Hash url token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await AdminUser.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }, //expire time is gt Date.now()
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Password Reset token is invalid or has been expired.",
        400
      )
    );
  }

  // Setup new password
  user.password = req.body.password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// Logout user   =>   /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});
