const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { startListener } = require("./indexer/listener");
const { startBot } = require("./bot");
const { syncAllEvents } = require("./indexer/sync");
const app = express();
const port = 3000;

// ====================== MIDDLEWARE ======================
app.use(cors());
app.use(express.json());

// ====================== ROUTES ======================
app.use("/aave", require("./routes/aaveRoutes"));
app.get("/", (req, res) => {
  res.json({
    message: "Liquidation Bot Backend is Running",
    status: "active",
  });
});

// ====================== START BOT ======================
async function startSystem() {
  try {
    console.log("=== Liquidation Bot System Initializing ===\n");

    // 1. Connect to Database
    await connectDB();
    console.log(" Database connected");

    // 2. Sync historical events
    console.log("Syncing past events...");
    await syncAllEvents();

    // 3. Start real-time event listener
    startListener();

    // 4. Start liquidation scanning bot
    startBot();

    console.log("All systems started successfully!");
  } catch (error) {
    console.error("Failed to start system:", error.message);
    process.exit(1); // Exit if critical error
  }
}

// Start Express Server
app.listen(port, () => {
  console.log(` Server running on http://localhost:${port}`);

  // Start the bot system after server is running
  startSystem();
});
