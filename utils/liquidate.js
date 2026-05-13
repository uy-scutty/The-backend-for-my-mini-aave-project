const contract = require("../config/contract");
const UserPosition = require("../models/userPosition");

async function attemptLiquidation(userAddress) {
  try {
    console.log(`Attempting to liquidate user: ${userAddress}`);

    // Get user data from database
    const userDoc = await UserPosition.findOne({
      userAddress: userAddress.toLowerCase(),
    });

    if (!userDoc) {
      console.log("User not found in database");
      return false;
    }

    if (!userDoc.debtAsset) {
      console.log("No debt asset recorded for this user");
      return false;
    }

    if (!userDoc.collateralAsset) {
      console.log("No collateral asset recorded for this user");
      return false;
    }

    // Get latest total debt
    const totalDebt = await contract.getTotalDebt(userAddress);
    const repayAmount = BigInt(totalDebt) / 2n; // 50% of debt

    console.log(`Liquidating user ${userAddress}`);
    console.log(`Debt Asset     : ${userDoc.debtAsset}`);
    console.log(`Collateral Asset: ${userDoc.collateralAsset}`);
    console.log(`Repay Amount    : ${repayAmount.toString()}`);

    // Execute liquidation
    const tx = await contract.liquidate(
      userAddress,
      userDoc.debtAsset,
      userDoc.collateralAsset,
      repayAmount,
    );

    console.log(`Transaction sent: ${tx.hash}`);

    const receipt = await tx.wait();

    console.log(`Liquidation successful! Tx Hash: ${receipt.transactionHash}`);

    return true;
  } catch (error) {
    console.error(`Liquidation failed for ${userAddress}:`, error.message);
    return false;
  }
}

module.exports = { attemptLiquidation };
