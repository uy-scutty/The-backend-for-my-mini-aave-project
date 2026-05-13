const contract = require("../config/contract");

async function getUserPosition(userAddress) {
  try {
    if (!userAddress) return null;

    const healthFactorRaw = await contract.calculateHealthFactor(userAddress);
    const isLiquidatableFlag = await contract.isLiquidatable(userAddress);

    const totalDebt = await contract.getTotalDebt(userAddress);
    const totalCollateral = await contract.getTotalCollateral(userAddress);

    const healthFactor = Number(healthFactorRaw) / 1e18;

    return {
      userAddress: userAddress.toLowerCase(),
      healthFactor,
      isLiquidatable: isLiquidatableFlag || healthFactor < 1,
      totalDebt: totalDebt.toString(),
      totalCollateral: totalCollateral.toString(),
      debtAsset: null,
      collateralAsset: null,
    };
  } catch (error) {
    console.error(
      `Failed to check position for ${userAddress.slice(0, 8)}...:`,
      error.message,
    );
    return null;
  }
}

module.exports = { getUserPosition };
