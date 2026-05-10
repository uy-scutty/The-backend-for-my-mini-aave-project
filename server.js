const crypto = require("crypto");
const express = require("express");
const cors = require("cors");
const port = 3000;
const app = express();

global.crypto = crypto;
app.use(express.json());

const connectDB = require("./config/db");
const startListener = require("./indexer/listener");
const syncDeposits = require("./indexer/sync");

app.listen(port, () => {
  console.log("Backend running on port 3000");
});

connectDB();
startListener();
syncDeposits();

app.use(cors());

app.use("/aave", require("./routes/aaveRoutes"));
