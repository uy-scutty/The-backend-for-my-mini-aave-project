// utils/updateUser.js
const UserPosition = require("../models/userPosition");
const { hasOutstandingDebt } = require("./checkUserDebt");

async function updateUserDebtStatus(
  userAddress,
  hasDebt = null, // why this shit null
  debtAsset = null,
) {
  try {
    if (!userAddress) return;

    let finalHasDebt = hasDebt;
    // tbh i so do not understand this line or the whole contract sef like i know this checks user debt status but how does it work in repay
    // this checks userDebt if non was passed(null) checks user debt from the maincontract (protocol)
    if (finalHasDebt === null) {
      // what is with the three equal to sign
      finalHasDebt = await hasOutstandingDebt(userAddress);
    }

    await UserPosition.findOneAndUpdate(
      { userAddress: userAddress.toLowerCase() },
      {
        hasActiveDebt: finalHasDebt,
        debtAsset: debtAsset,
        lastChecked: Date.now(),
      },
      { upsert: true },
    );

    console.log(
      `✅ User ${userAddress.slice(0, 8)}... | Debt: ${finalHasDebt} | Asset: ${debtAsset || "N/A"}`,
    );
  } catch (error) {
    console.error("Error updating user debt status:", error.message);
  }
}

module.exports = { updateUserDebtStatus };
