const contract = require("../config/contract");
const Transaction = require("../models/transaction");

async function syncDeposits() {
  const events = await contract.queryFilter("Deposited", 0, "latest");

  for (const event of events) {
    const { user, asset, amount } = event.args;
    await Transaction.create({
      user,
      asset,
      amount: amount.toString(),
      type: "deposit",
      txHash: event.transactionHash,
      timeStamp: Date.now(),
    });
  }

  console.log("Sync Complete");
}
module.exports = syncDeposits;
