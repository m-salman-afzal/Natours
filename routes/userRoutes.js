import express from 'express';
import * as userController from '../controllers/userController.js';
import * as authController from '../controllers/authController.js';
import { User } from '../models/userModels.js';

//define a seperate router for each route
const userRouter = express.Router();

userRouter.route('/signup').post(authController.signUp);

userRouter.route('/login').post(authController.login);

userRouter.route('/forgotPassword').post(authController.forgotPassword);

userRouter.route('/resetPassword/:token').patch(authController.resetPassword);

userRouter
  .route('/updatePassword')
  .patch(authController.protect, authController.updatePassword);

userRouter
  .route('/updateMe')
  .patch(authController.protect, userController.updateMe);
userRouter.route('/').get(userController.getUser).post(userController.addUser);

userRouter
  .route('/:id')
  .get(userController.getSingleUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export { userRouter };
