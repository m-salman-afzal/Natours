import { User } from '../models/userModels.js';
import { catchAsync } from '../utils/catchAsync.js';

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

export { getUser, getSingleUser, addUser, updateUser, deleteUser };
