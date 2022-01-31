import { User } from '../models/userModels.js';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/appError.js';

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

const getUser = catchAsync(async (req, res, next) => {
  const usersData = await User.find();

  res.status(200).json({
    status: 'success',
    time: req.reqTime,
    results: usersData.length,
    data: {
      users: usersData,
    },
  });
});

const addUser = (req, res) => {
  res.status(500).json({
    status: 'success',
    time: req.reqTime,
    message: 'route not defined',
  });
};

const getSingleUser = (req, res) => {
  res.status(500).json({
    status: 'success',
    time: req.reqTime,
    message: 'route not defined',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'success',
    time: req.reqTime,
    message: 'route not defined',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'success',
    time: req.reqTime,
    message: 'route not defined',
  });
};

const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password update', 400));
  }

  // * filter unwanted info that the user might send like change their role
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    time: req.reqTime,
    data: {
      user: updateUser,
    },
  });
});
export { getUser, getSingleUser, addUser, updateUser, deleteUser, updateMe };
