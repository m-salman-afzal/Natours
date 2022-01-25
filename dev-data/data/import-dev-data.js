import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import { Tour } from '../../models/tourModels.js';

// * give path for the config file
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// * connect to the mongodb
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Mongoose Connection Successful');
  });

// * Read the local json data
const toursData = JSON.parse(
  fs.readFileSync('./dev-data/data/tours-simple.json')
);

// * import data from local to cloud
const importData = async () => {
  try {
    await Tour.create(toursData);
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// * delete the existing collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// * specify the 2nd argumentof terminal command to control the import or delete
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
