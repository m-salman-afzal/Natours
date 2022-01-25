import { Tour } from '../models/tourModels.js';

import { APIFeatures } from '../utils/apiFeatures.js';

// * get all the tours from collection
const getTour = async (req, res) => {
  try {
    const apiFeatures = await new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .fields()
      .page().query;
    // const toursData = await apiFeatures.query;
    const toursData = apiFeatures;

    res.status(200).json({
      status: 'success',
      time: req.reqTime,
      results: toursData.length,
      data: {
        tours: toursData,
      },
    });
  } catch (err) {
    console.log('Error here:😶‍🌫️', err);
    res.status(400).json({
      status: 'fail',
      message: 'Cannot retrieve tours data',
      error: err,
    });
  }
};

// * get single the tours from collection specified by id
const getSingleTour = async (req, res) => {
  try {
    console.log(req.params.id);
    const singleTour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      time: req.reqTime,
      data: {
        tours: singleTour,
      },
    });
  } catch (err) {
    console.log('Error here:😶‍🌫️', err);
    res.status(200).json({
      status: 'fail',
      message: 'cannot retrieve tour',
      error: err,
    });
  }
};

// * add a new tour doc to the collection
const addTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      time: req.reqTime,
      data: {
        tours: newTour,
      },
    });
  } catch (err) {
    console.log('Error here:😶‍🌫️', err);
    res.status(400).json({
      status: 'failed',
      message: 'unable to create tour',
      error: err,
    });
  }
};

// * update the doc of existing collection
const updateTour = async (req, res) => {
  try {
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
  } catch (err) {
    console.log('Error here:😶‍🌫️', err);
    res.status(400).json({
      status: 'failed',
      message: 'unable to update tour',
      error: err,
    });
  }
};

// * delete a tour doc
const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id, (err) => {
      console.log(err);
    });
    res.status(204).json({
      status: 'success',
      time: req.reqTime,
      data: null,
    });
  } catch (err) {
    console.log('Error here:😶‍🌫️', err);
    res.status(204).json({
      status: 'success',
      message: err,
    });
  }
};

const getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.6 } },
      },
      {
        $group: {
          _id: '$difficulty',
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
  } catch (err) {
    console.log('Error here:😶‍🌫️', err);
    res.status(204).json({
      status: 'success',
      message: err,
    });
  }
};

export {
  getTour,
  getSingleTour,
  addTour,
  updateTour,
  deleteTour,
  getTourStats,
};
