import jwt from 'jsonwebtoken';
import utils from 'util';
import crypto from 'crypto';

import { User } from '../models/userModels.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/appError.js';
import { sendEmail } from '../utils/email.js';

const signToken = (id) => {
  return jwt.sign(
    { id: id },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
    // * optional callback function
    // (err, token) => {
    //   console.log(token);
    // }
  );
};

const createSendToken = (user, statusCode, res, req) => {
  const token = signToken(user._id);

  // * create cookie
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV == 'production') {
    cookieOptions.secure = true;
  }

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    time: req.reqtime,
    token: token,
    data: {
      user: user,
    },
  });
};

const signUp = catchAsync(async (req, res, next) => {
  // const newUser = await User.create({
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: req.body.password,
  //   passwordConfirm: req.body.passwordConfirm,
  // });

  const newUser = await User.create(req.body);
  createSendToken(newUser, 201, res, req);
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email or Password not entered!', 400));
  }

  // * we need to use select since we provided select as false in schema
  const user = await User.findOne({ email: email }).select('+password');

  // TODO ask why when the below line does not work
  // const correct = await user.correctPassword(password, user.password);
  // console.log(correct);
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect Email or Password', 401));
  }

  createSendToken(user, 200, res, req);
});

const protect = catchAsync(async (req, res, next) => {
  let token;

  // * check if we get auth token in header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = await req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Not logged in. Log in here', 401));
  }

  // * check if the token correct or verified
  const decoded = await utils.promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET_KEY
  );

  // * check if the user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('User with this token no longer exists', 401));
  }

  // * check if user recently changed the password and has not yet logged in again
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('Password recently changed! Login again', 401));
  }
  req.user = currentUser;

  // * finaly grant access to the user to the required tour by authenticating them
  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'Permission denied! Role not assigned for current operation',
          403
        )
      );
    }
    next();
  };
};

const forgotPassword = catchAsync(async (req, res, next) => {
  // * check if the user exists or not
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError(
        `User with email: ${req.body.email} does not exist. Maybe create a new account`,
        404
      )
    );
  }

  // * generate reset crypto token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // * send token to user mail
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot Password? Submit a PATCh request with your new passowrd and passwordConfirm to: ${resetURL}.\nIf you didn't, kindly ignore this email.`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Natours Password Reset',
      message: message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token send to email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError("Couldn't send email. Try again later", 500));
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  // * Get the user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gte: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res, req);
});

const updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Current Password wrong', 401));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  createSendToken(user, 200, res, req);
});

export {
  signUp,
  login,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updatePassword,
};
