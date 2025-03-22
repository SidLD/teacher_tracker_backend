const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    employeeId: String,
    birthDate: Date,
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    middleName: String,
    password: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true
    },
    contact: {
      type: String,
      required: true
    },
    gender: {
      type: String,
    },
    age: {
      type: Number,
      min: 1,
      max: 100,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      index: true,
      enum: ["TEACHER", "SUPERADMIN"],
    },
    isApprove: {
      type: Boolean,
      required: true
    },
    position: {
      type:mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
