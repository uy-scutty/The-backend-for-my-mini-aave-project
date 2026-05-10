const express = require("express");
const router = express.Router();
const service = require("../services/aaveService");
const Transaction = require("../models/transaction");

// deposit route
router.post("/deposit", async (req, res) => {
  try {
    const { amount, asset } = req.body;

    const txHash = await service.deposit(amount, asset);
    res.json({ success: true, txHash });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// borrow route
router.post("/borrow", async (req, res) => {
  try {
    const { asset, amount } = req.body;

    const txHash = await service.borrow(asset, amount);
    res.json({ success: true, txHash });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// userdata route

router.get("/user/:address/:asset", async (req, res) => {
  try {
    const { address, asset } = req.params;

    const data = await service.getUserData(address, asset);
    res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/history/:user", async (req, res) => {
  const data = await Transaction.find({
    user: req.params.user,
  });
  res.json(data);
});
module.exports = router;
