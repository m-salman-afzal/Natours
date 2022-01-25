import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { app } from './app.js';

// * give path for the config file
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// * connect mongoose to the DB
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log(
      '--------------------------------\n Mongoose Connection Successful\n--------------------------------'
    );
  });

// * start the server and listen to the following port
const port = process.env.PORT || 8000;
const ip = process.env.IP || '127.0.0.1';

app.listen(port, ip, () => {
  console.log(`
-----------------------------
 Listening to ${ip}:${port}
-----------------------------`);
});
