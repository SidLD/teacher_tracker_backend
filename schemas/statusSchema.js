const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Status", userSchema);
