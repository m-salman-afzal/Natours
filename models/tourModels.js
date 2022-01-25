import mongoose from 'mongoose';

// * start a new schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tour must have a name'],
      unique: false,
      trim: true,
      maxlength: [30, 'Name too long, cannot be greater than 30'],
      maxlength: [10, 'Name too short, cannot be less than 10'],
    },
    alterName: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, 'Tour must have a name'],
    },
    ratingsAverage: {
      type: Number,
      default: 4,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'Tour must have a diffuclty'],
      enum: {
        values: ['easy', 'medium', 'hard'],
        message: 'Wrong difficulty',
      },
    },
    discount: {
      type: Number,
      validate: {
        validator: function (val) {
          // * not going to work on updates, works only for the full creation of new document
          return val < this.price;
        },
        message: 'Discount price must be lower than original price',
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'Tour must have a image cover'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    duration: {
      type: Number,
      required: [true, 'The tour must have a duration'],
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
  },
  {
    toObject: { virtuals: true },
  }
);

// * create a virtual document. We need to use the simple function and not the arrow one since this keyword is not available in arrow funcitons
// tourSchema.virtual('durationWeeks').get(function () {
//   return this.duration / 7;
// });

// * make a document middleware that runs before saving the document due to save hook defined in pre and post methods
// tourSchema.pre('save', function (next) {
//   this.alterName = `${this.name}-1`;
//   console.log(this);
//   next();
// });

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
const Tour = mongoose.model('Tour', tourSchema);

export { Tour };
