// utils/checkUserDebt.js
const contract = require("../config/contract");

// this function checks if user has debt and returns the debt i.e it calls the smart contract
async function hasOutstandingDebt(userAddress) {
  try {
    if (!userAddress) return false;

    const borrowAmount = await contract.getTotalDebt(userAddress);

    // Convert to BigInt safely
    const debtInWei = BigInt(borrowAmount.toString());

    return debtInWei > 0n; // what the fuck does 0n mean?
  } catch (error) {
    console.error(
      `Error checking debt for ${userAddress.slice(0, 8)}...:`,
      error.message,
    );
    return true; // Safer to assume they have debt if check fails
  }
}

module.exports = { hasOutstandingDebt };
