const contract = require("../config/contract");
const Transaction = require("../models/transaction");
const UserPosition = require("../models/userPosition");

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

    console.log(`✅ ${type} saved`);
  } catch (error) {
    if (error.code === 11000) {
      console.log("Duplicate skipped");
    } else {
      console.error(error?.error);
    }
  }
}

async function updateUserDebtStatus(userAddress, hasDebt, debtAsset) {
  try {
    await UserPosition.findOneAndUpdate(
      { userAddress: userAddress.toLowerCase() },
      { hasActiveDebt: hasDebt, debtAsset: debtAsset, lastChecked: Date.now() },
      { upsert: true },
    );
  } catch (error) {
    console.error("Error updating user debt status: ", error.message);
  }
}

// Main function
function startListener() {
  console.log("Starting event listener...");

  // Deposit
  contract.on("Deposited", (user, asset, amount, event) => {
    saveTransaction(event, "deposit");
  });

  // Withdraw
  contract.on("Withdrawn", (user, asset, amount, event) => {
    saveTransaction(event, "withdraw");
  });

  // Borrow
  contract.on("Borrowed", (user, asset, amount, event) => {
    saveTransaction(event, "borrow");
    updateUserDebtStatus(user, true, asset);
  });

  // Repay // still want to fix repay to check if they have fully paid all there debts then mark hasdebt as false
  contract.on("Repaid", (user, asset, amount, event) => {
    saveTransaction(event, "repay");
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
    },
  );

  console.log("Listening to all events...");
}

module.exports = startListener;
