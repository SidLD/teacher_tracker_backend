const mongoose = require("mongoose");
const categorySchema = mongoose.Schema(
  {
    position: {
      type: String,
      required: true,
      enum: ["PROF", "NON-PROF"],
    },
    name:{
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Category", categorySchema);
