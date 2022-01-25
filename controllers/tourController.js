import { Tour } from '../models/tourModels.js';

// * get all the tours from collection
const getTour = async (req, res) => {
  try {
    // * below are some methods that can be used to query the data required
    // * 1
    // const toursData = await Tour.find();

    // * 2
    // const toursData = await Tour.find({
    //   difficulty: 'easy',
    //   duration: 5,
    // });

    // * 3
    // const toursData = await Tour.find().where('duration').lte(10);

    // * 4
    // const queryObj = { ...req.query };
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach((el) => delete queryObj[el]);
    // console.log(queryObj, excludedFields);
    // const toursData = await Tour.find(queryObj);

    // * 5
    const queryObj = { ...req.query };
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Tour.find(JSON.parse(queryStr));

    // * sort the response with the given query
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // * send only the specified fields as requested by the query
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // * apply pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 1;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // if (req.query.page) {
    //   const totalDocs = await Tour.countDocuments();
    //   console.log(totalDocs);
    //   if (totalDocs < skip) {
    //     throw new Error('Page does not exist');
    //   }
    // }
    const toursData = await query;

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
    res.status(204).json({
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
    res.status(200).json({
      status: 'success',
      time: req.reqTime,
      data: null,
    });
  } catch (err) {
    console.log('Error here:😶‍🌫️', err);
    res.status(204).json({
      status: 'fail',
      message: err,
    });
  }
};

export { getTour, getSingleTour, addTour, updateTour, deleteTour };
