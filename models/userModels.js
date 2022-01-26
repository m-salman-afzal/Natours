import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

// * start a new schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Usermust have a name'],
      unique: false,
      trim: true,
      // maxlength: [30, 'Name too long, cannot be greater than 30'],
      // maxlength: [10, 'Name too short, cannot be less than 10'],
    },
    email: {
      type: String,
      required: [true, 'User must have a email'],
      trim: true,
      validate: [validator.isEmail, 'Not a valid email'],
    },
    photo: {
      type: String,
    },
    password: {
      type: String,
      required: [true, 'User must have a password'],
      minlength: 8,
    },
    passwordConfirm: {
      type: String,
      validate: {
        // * this only works for the model.create or model.save methods
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not same',
      },
    },
  }
  // {
  //   toJSON: { virtuals: true },
  // },
  // {
  //   toObject: { virtuals: true },
  // }
);

// * create a virtual document. We need to use the simple function and not the arrow one since this keyword is not available in arrow funcitons
// tourSchema.virtual('durationWeeks').get(function () {
//   return this.duration / 7;
// });

// * make a document middleware that runs before saving the document due to save hook defined in pre and post methods
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// tourSchema.post('save', function (doc, next) {
//   // this.alterName = `${this.name}-1`;
//   console.log(doc);
//   next();
// });

// * make a query middleware that may filter out certain results based on a single property defined in the document of collection
// tourSchema.pre(/^find/, function (next) {
//   this.find({ secretTour: { $ne: true } });
//   this.start = Date.now();
//   next();
// });

// tourSchema.post(/^find/, function (docs, next) {
//   // this.find({ secretTour: { $ne: true } });
//   console.log(`${Date.now() - this.start}`);
//   next();
// });

//* make an aggregate middleware
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });

// * connect schema to model
const User = mongoose.model('User', userSchema);

export { User };
