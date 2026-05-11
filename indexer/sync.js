const contract = require("../config/contract");
const Transaction = require("../models/transaction");
const {
  updateUserDebtStatus,
} = require("../services/utils/updateUserPosition");

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

    const { user, asset } = event.args;
    await updateUserDebtStatus(user, true, asset);
  }

  const repays = await contract.queryFilter("Repaid", 0, "latest");
  for (const event of repays) {
    await saveEvent(event, "repay");

    const { user, asset } = event.args;
    await updateUserDebtStatus(user, null, asset);
  }

  // LIQUIDATION
  const liquidates = await contract.queryFilter("Liquidated", 0, "latest");
  for (const event of liquidates) {
    const { debtAsset, collateralAsset } = event.args;

    await saveEvent(event, "liquidate", {
      debtAsset,
      collateralAsset,
    });

    const { user, debtAsset } = event.args;
    await updateUserDebtStatus(user, null, debtAsset);
  }

  console.log("Sync Complete");
}

module.exports = syncAllEvents;
