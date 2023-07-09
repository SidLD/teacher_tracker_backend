const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
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
      required: true,
    },
    schoolId: {
      type: String,
      required: true,
    },
    email: {
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
    batch: {
      type: Number,
      min : 1000,
      max : 9999,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      index: true,
      enum: ["student", "teacher", "superadmin"],
    },
    isApprove: {
      type: Boolean,
      required: true
    },
    status: [
      {
        category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
        },
        position: String,
        description: String,
        date: Date
      }
    ]
    // recentAccess: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Exam",
    //   }
    // ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
