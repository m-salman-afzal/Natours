import { User } from '../models/userModels.js';
import { catchAsync } from '../utils/catchAsync.js';

const signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  res.status(200).json({
    status: 'success',
    time: req.reqtime,
    data: {
      newUser,
    },
  });
});
export { signUp };
