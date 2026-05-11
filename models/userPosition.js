const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema({
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
  lastBorrowTimestamp: {
    type: Date,
    default: null,
  },
  lastChecked: {
    type: Date,
    default: Date.now,
  },
});
const UserPosition = mongoose.model("UserPosition", userPositionSchema);

module.exports = UserPosition;
