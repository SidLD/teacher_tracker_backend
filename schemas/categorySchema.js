const mongoose = require("mongoose");
const categorySchema = mongoose.Schema(
  {
    position: {
      type: String,
      required: true,
      enum: ["TEACHING", "NON_TEACHING"],
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
