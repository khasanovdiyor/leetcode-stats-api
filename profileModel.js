const mongoose = require("mongoose");

const profileStats = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  missedDaysCount: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: "2d",
  },
});
const ProfileStats = mongoose.model("ProfileStats", profileStats);
module.exports = { ProfileStats };
