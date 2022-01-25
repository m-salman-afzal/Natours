import express from 'express';
import * as tourController from '../controllers/tourController.js';

// * define a seperate router for each route
const tourRouter = express.Router();

// tourRouter.param('id', tourController.checkID);

// tourRouter.route('/tour-stats').get(tourController.getTourStats);
// tourRouter.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

tourRouter.route('/').get(tourController.getTour).post(tourController.addTour);

tourRouter
  .route('/:id')
  .get(tourController.getSingleTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

// ! Below methods are longer and should not be used
// //Send data from the server to the client side
// app.get('/api/v1/tours', getTour);

// //Send data from client to server by creating a new object that was sent form POSTMAN
// app.post('/api/v1/tours', addTour);

// //Send data from the server to the client side for a specific id
// app.get('/api/v1/tours/:id', getSingleTour);

// //update the values in the database
// app.patch('/api/v1/tours/:id', updateTour);

// //delete tour
// app.delete('/api/v1/tours/:id', deleteTour);
// !

export { tourRouter };
