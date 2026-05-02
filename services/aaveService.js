const contract = require("../config/contract");
const { ethers } = require("ethers");

// deposit service
async function deposit(amount, asset) {
  const tx = await contract.deposit(
    ethers.parseUnits(amount.toString(), 18),
    asset,
  );
  await tx.wait();
  return tx.hash;
}

// borrow servie
async function borrow(asset, amount) {
  const tx = await contract.borrow(asset, amount);
  await tx.wait();
  return tx.hash;
}

// user position in the system
async function getUserData(user, asset) {
  const balance = await contract.getBalance(user);
  const debt = await contract.getTotalDebt(user);
  const collateral = await contract.getTotalCollatersl(user);
  const health = await contract.calculateHealthFactor(user);

  return {
    balance: balance.toString(),
    debt: debt.toString(),
    collateral: collateral.toString(),
    health: health.toString(),
  };
}
