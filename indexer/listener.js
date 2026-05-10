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

  contract.on("Withdrawn", async (user, asset, amount, event) => {
    console.log("Withdraw detected");

    await Transaction.create({
      user,
      asset,
      amount: amount.toString(),
      type: "withdraw",
      txHash: event.log.transactionHash,
      timestamp: Date.now(),
    });
  });

  contract.on("Borrowed", async (user, asset, amount, event) => {
    console.log("Borrow detected");

    await Transaction.create({
      user,
      asset,
      amount: amount.toString(),
      type: "borrow",
      txHash: event.log.transactionHash,
      timestamp: Date.now(),
    });
  });

  contract.on("Repaid", async (user, asset, amount, event) => {
    console.log("Repay detected");

    await Transaction.create({
      user,
      asset,
      amount: amount.toString(),
      type: "repay",
      txHash: event.log.transactionHash,
      timestamp: Date.now(),
    });
  });

  contract.on(
    "Liquidated",
    async (user, debtAsset, collateralAsset, amount, event) => {
      console.log("Liquidation detected");

      await Transaction.create({
        user,
        asset: collateralAsset,
        amount: amount.toString(),
        type: "liquidate",
        txHash: event.log.transactionHash,
        timestamp: Date.now(),
      });
    },
  );
}

module.exports = startListener;
