const mongoose = require("mongoose");
// what is a module

const transactionSchema = new mongoose.Schema({
  user: String,
  asset: String,
  amount: String,
  type: String,
  txHash: { type: String, unique: true },
  timestamp: Number,
});

module.exports = mongoose.model("Transaction", transactionSchema);
