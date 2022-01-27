import jwt from 'jsonwebtoken';

import { User } from '../models/userModels.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/appError.js';

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

const signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);
  console.log(req.time);
  res.status(200).json({
    status: 'success',
    time: req.reqtime,
    token: token,
    data: {
      user: newUser,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email or Password not entered!', 400));
  }

  // * we need to use select since we provided select as false in schema
  const user = await User.findOne({ email: email }).select('+password');

  const correct = await user.correctPassword(password, user.password);

  if (!user || !correct) {
    return next(new AppError('Incorrect Email or Password', 401));
  }

  const token = signToken(user._id);

  res.status(201).json({
    status: 'success',
    time: req.reqtime,
    token: token,
  });
});

export { signUp, login };
