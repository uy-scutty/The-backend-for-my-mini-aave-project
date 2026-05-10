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

// withdraw service
async function withdraw(amount, asset) {
  const tx = await contract.withdraw(
    ethers.parseUnits(amount.toString(), 18),
    asset,
  );
  await tx.wait();
  return tx.hash;
}

// borrow service
async function borrow(asset, amount) {
  const tx = await contract.borrow(
    asset,
    ethers.parseUnits(amount.toString(), 18),
  );
  await tx.wait();
  return tx.hash;
}

// repay service
async function repay(asset, amount) {
  const tx = await contract.repay(
    asset,
    ethers.parseUnits(amount.toString(), 18),
  );
  await tx.wait();
  return tx.hash;
}
// user position in the system
async function getUserData(user, asset) {
  const balance = await contract.getBalance(user, asset);
  const debt = await contract.getTotalDebt(user);
  const collateral = await contract.getTotalCollateral(user);
  const health = await contract.calculateHealthFactor(user);

  return {
    balance: balance.toString(),
    debt: debt.toString(),
    collateral: collateral.toString(),
    health: health.toString(),
  };
}

module.exports = {
  deposit,
  withdraw,
  borrow,
  repay,
  getUserData,
};
