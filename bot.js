// bot.js
const { getUserPosition } = require("./utils/checkHealthFactor");
const { attemptLiquidation } = require("./utils/liquidate");
const UserPosition = require("./models/userPosition");
const { updateUserDebtStatus } = require("./utils/updateUserPosition");

async function scanForLiquidations() {
  console.log("Starting new liquidation scan...");

  try {
    const usersWithDebt = await UserPosition.find({ hasActiveDebt: true });

    console.log(`Checking ${usersWithDebt.length} users with active debt...`);

    let liquidatableFound = 0;

    for (const userDoc of usersWithDebt) {
      const address = userDoc.userAddress;

      // Get latest position from contract
      const position = await getUserPosition(address);

      if (!position) continue;

      console.log(
        `   Checking ${address.slice(0, 8)}... | HF: ${position.healthFactor.toFixed(4)}`,
      );

      if (position.isLiquidatable) {
        liquidatableFound++;
        console.log(` LIQUIDATABLE POSITION DETECTED! ${address}`);

        // Attempt liquidation
        const success = await attemptLiquidation(address);

        if (success) {
          // Update user status after successful liquidation
          await updateUserDebtStatus(address, null);
        }

        //Added delay between liquidations to avoid nonce issues
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }

    if (liquidatableFound === 0) {
      console.log(" Scan completed - No liquidatable positions found.");
    } else {
      console.log(
        ` Scan completed - Found ${liquidatableFound} liquidatable position(s)`,
      );
    }
  } catch (error) {
    console.error("Critical error during scan:", error.message);
  }
}

// ==================== START BOT ====================
async function startBot() {
  console.log("Liquidation Bot Scanner Started...\n");

  // First scan immediately
  await scanForLiquidations();

  // Then scan every 10 seconds
  setInterval(scanForLiquidations, 10000);
}

module.exports = { startBot };
