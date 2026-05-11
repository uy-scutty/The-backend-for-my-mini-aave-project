const { ethers } = require("ethers");
require("dotenv").config();

const abi = [
  "function deposit(uint256 amount, address asset)",
  "function withdraw(uint256 amount, address asset)",
  "function borrow(address asset, uint256 amount)",
  "function repay(address asset, uint256 amount)",
  "function getBalance(address user, address asset) view returns (uint256)",
  "function getTotalDebt(address user) view returns (uint256)",
  "function getTotalCollateral(address user) view returns (uint256)",
  "function calculateHealthFactor(address user) view returns(uint256)",
  "function isLiquidatable(address user) public view returns (bool)",
  "function liquidate(address user, address debtAsset, address collateralAsset, uint256 repayAmount)",
  "event Deposited(address indexed user, address indexed asset, uint256 amount)",
  "event Withdrawn(address indexed user, address indexed asset, uint256 amount)",
  "event Borrowed(address indexed user, address indexed asset, uint256 amount)",
  "event Repaid(address indexed user, address indexed asset, uint256 amount)",
  "event Liquidated(address indexed user, address indexed debtAsset, address indexed collateralAsset, uint256 amount)",
];

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, abi, wallet);

module.exports = contract;
