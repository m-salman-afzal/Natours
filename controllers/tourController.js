import { Tour } from '../models/tourModels.js';

import { APIFeatures } from '../utils/apiFeatures.js';
import { catchAsync } from '../utils/catchAsync.js';

// * get all the tours from collection
const getTour = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .fields()
    .paginate();
  const toursData = await features.query;
  // const toursData = apiFeatures;

  res.status(200).json({
    status: 'success',
    time: req.reqTime,
    results: toursData.length,
    data: {
      tours: toursData,
    },
  });
});

// * get single the tours from collection specified   by id
const getSingleTour = catchAsync(async (req, res, next) => {
  console.log(req.params.id);
  const singleTour = await Tour.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    time: req.reqTime,
    data: {
      tours: singleTour,
    },
  });
});

// * add a new tour doc to the collection
const addTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    time: req.reqTime,
    data: {
      tours: newTour,
    },
  });
});

// * update the doc of existing collection
const updateTour = catchAsync(async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(201).json({
    status: 'success',
    time: req.reqTime,
    data: {
      tours: updatedTour,
    },
  });
});

// * delete a tour doc
const deleteTour = catchAsync(async (req, res, next) => {
  await Tour.findByIdAndDelete(req.params.id, (err) => {
    console.log(err);
  });
  res.status(204).json({
    status: 'success',
    time: req.reqTime,
    data: null,
  });
});

const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 1.0 } },
    },
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        avgRating: { $avg: '$ratingsAverage' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    time: req.reqTime,
    data: {
      stats: stats,
    },
  });
});

const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  // console.log(typeof year);
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTours: { $sum: 1 },
        tours: { $push: '$name' },
        // gg: { month: '$_id' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
  ]);
  res.status(200).json({
    status: 'success',
    time: req.reqTime,
    results: plan.length,
    data: {
      plans: plan,
    },
  });
});

export {
  getTour,
  getSingleTour,
  addTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
};
