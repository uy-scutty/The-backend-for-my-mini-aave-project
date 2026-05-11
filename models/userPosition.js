const mongoose = require("mongoose");

const userPositionSchema = new mongoose.Schema({
  useraAddress: {
    type: string,
    require: true,
    unique: true,
    lowercase: true,
  },
  hasDebt: {
    type: Boolean,
    default: false,
  },
  debtAsset,
  lastChecked: {
    type: Date,
    default: Date.now,
  },
});
const UserPosition = mongoose.model("UserPosition", userPositionSchema);

module.exports = UserPosition;
