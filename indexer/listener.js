const contract = require("../config/contract");
const Transaction = require("../models/transaction");
const UserPosition = require("../models/userPosition");
const { updateUserDebtStatus } = require("../utils/updateUserPosition");

// Simple helper function
async function saveTransaction(event, type, extra = {}) {
  try {
    const { user, asset, amount } = event.args;

    await Transaction.create({
      user,
      asset,
      amount: amount.toString(),
      type,
      txHash: event.transactionHash || event.log?.transactionHash,
      timestamp: Date.now(),
      ...extra,
    });

    console.log(`${type} saved`);
  } catch (error) {
    if (error.code === 11000) {
      console.log("Duplicate skipped");
    } else {
      console.error(error?.error);
    }
  }
}

// Main function
function startListener() {
  console.log("Starting event listener...");

  // Deposit
  contract.on("Deposited", (user, asset, amount, event) => {
    saveTransaction(event, "deposit");
    updateUserDebtStatus(user, null, null, asset);
  });

  // Withdraw
  contract.on("Withdrawn", (user, asset, amount, event) => {
    saveTransaction(event, "withdraw");
  });

  // Borrow
  contract.on("Borrowed", (user, asset, amount, event) => {
    saveTransaction(event, "borrow");
    updateUserDebtStatus(user, true, asset, null);
  });

  //Repay
  contract.on("Repaid", (user, asset, amount, event) => {
    saveTransaction(event, "repay");
    updateUserDebtStatus(user, null, null, null);
  });

  // Liquidation
  contract.on(
    "Liquidated",
    (user, debtAsset, collateralAsset, amount, event) => {
      saveTransaction(event, "liquidate", {
        debtAsset,
        collateralAsset,
        asset: collateralAsset,
      });
      updateUserDebtStatus(user, null, debtAsset, collateralAsset);
    },
  );

  console.log("Listening to all events...");
}

module.exports = { startListener };
