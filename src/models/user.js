const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      minlength: [1, 'Name can not be less than 1 character'],
      trim: true,
      required: [true, 'Name must be provided'],
    },
    username: {
      type: String,
      minlength: [3, 'Username can not be less than 3 characters'],
      trim: true,
      required: [true, 'Username must be provided'],
      match: [
        /^\w[a-zA-Z0-9]*$/,
        'Username can only be capital letter, small letters and numbers. No spaces or special characters',
      ],
      unique: true,
    },
    password: {
      type: String,
      minlength: [8, 'Password can not be less than 8 characters'],
      trim: true,
      required: [true, 'Password must be provided'],
      // match: [/(?=.*
      // [a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/, 'Password cannot have whitespace character'],
      select: false,
    },
    emailAddress: {
      type: String,
      minlength: [5, 'Email address can not be less than 6 characters'],
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide valid email address',
      ],
      lowercase: [true, 'Email address must be in lowercase'],
      unique: true,
      default: null,
      sparse: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'non-binary', 'none'],
      default: 'none',
    },
    books: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'UserBook',
      },
    ],
    verifiedEmail: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre('save', async function (next) {
  // only run this function is password was modified
  // if (!this.isModified("password")) return next();
  // hash password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', userSchema);
