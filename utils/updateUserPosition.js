const UserPosition = require("../models/userPosition");
const { hasOutstandingDebt } = require("./checkUserDebt");

async function updateUserDebtStatus(
  userAddress,
  hasDebt = null,
  debtAsset = null,
  collateralAsset = null,
) {
  try {
    if (!userAddress) return;

    let finalHasDebt = hasDebt;

    if (finalHasDebt === null) {
      finalHasDebt = await hasOutstandingDebt(userAddress);
    }

    await UserPosition.findOneAndUpdate(
      { userAddress: userAddress.toLowerCase() },
      {
        hasActiveDebt: finalHasDebt,
        debtAsset: debtAsset,
        collateralAsset: collateralAsset,
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
