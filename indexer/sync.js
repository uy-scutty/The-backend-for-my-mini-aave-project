const contract = require("../config/contract");
const Transaction = require("../models/transaction");

async function saveEvent(event, type, extra = {}) {
  const { user, asset, amount } = event.args;

  await Transaction.updateOne(
    { txHash: event.transactionHash },
    {
      $setOnInsert: {
        user,
        asset,
        amount: amount.toString(),
        type,
        txHash: event.transactionHash,
        timestamp: Date.now(),
        ...extra,
      },
    },
    { upsert: true },
  );
}

async function syncAllEvents() {
  console.log("syncing past events.... ");

  // DEPOSIT
  const deposits = await contract.queryFilter("Deposited", 0, "latest");
  for (const event of deposits) {
    await saveEvent(event, "deposit");
  }

  // WITHDRAW
  const withdraws = await contract.queryFilter("Withdrawn", 0, "latest");
  for (const event of withdraws) {
    await saveEvent(event, "withdraw");
  }

  // BORROW
  const borrows = await contract.queryFilter("Borrowed", 0, "latest");
  for (const event of borrows) {
    await saveEvent(event, "borrow");

    const user = event.args.user;
    await updateUserDebtStatus(user, true);
  }
  // NEEED TO SYNC REPAY TOO
  // REPAY
  const repays = await contract.queryFilter("Repaid", 0, "latest");
  for (const event of repays) {
    await saveEvent(event, "repay");
  }

  // LIQUIDATION
  const liquidates = await contract.queryFilter("Liquidated", 0, "latest");
  for (const event of liquidates) {
    const { debtAsset, collateralAsset } = event.args;

    await saveEvent(event, "liquidate", {
      debtAsset,
      collateralAsset,
    });
  }

  console.log("Sync Complete");
}

module.exports = syncAllEvents;
