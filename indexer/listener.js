const contract = require("../config/contract");
const Transaction = require("../models/transaction");

function startListener() {
  contract.on("Deposited", async (user, asset, amount, event) => {
    console.log("Deposit detected");

    await Transaction.create({
      user,
      asset,
      amount: amount.toString(),
      type: "deposit",
      txHash: event.log.transactionHash,
      timestamp: Date.now(),
    });
  });
}

module.exports = startListener;
