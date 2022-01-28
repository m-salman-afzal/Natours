import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

// * start a new schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Usermust have a name'],
    unique: false,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'User must have a email'],
    trim: true,
    unique: true,
    validate: [validator.isEmail, 'Not a valid email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'User must have a password'],
    minlength: 8,
    select: false,
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
  passwordChangedAt: Date,
  role: {
    type: String,
    enum: ['admin', 'lead-guide', 'guide', 'user'],
    default: 'user',
  },
});

// * make a document middleware that runs before saving the document due to save hook defined in pre and post methods
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

// * define a method that is available on all the docs of collection
userSchema.methods.correctPassword = async (
  candidatePassword,
  userPassword
) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (jwtTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return jwtTimeStamp < changedTimeStamp;
  }

  return false;
};

// * connect schema to model
const User = mongoose.model('User', userSchema);

export { User };
