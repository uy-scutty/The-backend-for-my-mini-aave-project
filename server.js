const express = require("express");
const cors = require("cors");
const port = 3000;
const app = express();

const connectDB = require("./config/db");
const startListener = require("./indexer/listener");
const syncDeposits = require("./indexer/sync");

connectDB();
startListener();
syncDeposits();

app.use(cors());

app.use("/aave", require("./routes/aaveRoutes"));
app.listen(3000, () => {
  console.log("Backend running on port 3000");
});
