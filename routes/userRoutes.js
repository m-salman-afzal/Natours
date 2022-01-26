import express from 'express';
import * as userController from '../controllers/userController.js';
import * as authController from '../controllers/authController.js';

//define a seperate router for each route
const userRouter = express.Router();

userRouter.post('/signup', authController.signUp);

userRouter.route('/').get(userController.getUser).post(userController.addUser);
userRouter
  .route('/:id')
  .get(userController.getSingleUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export { userRouter };
