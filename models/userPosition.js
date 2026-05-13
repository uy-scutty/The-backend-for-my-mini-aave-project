const mongoose = require("mongoose");

const userPositionSchema = new mongoose.Schema({
  userAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  hasActiveDebt: {
    type: Boolean,
    default: false,
  },
  debtAsset: String,
  collateralAsset: String,
  lastChecked: {
    type: Date,
    default: Date.now,
  },
});
const UserPosition = mongoose.model("UserPosition", userPositionSchema);

module.exports = UserPosition;
