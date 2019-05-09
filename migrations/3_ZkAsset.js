
const ACE = artifacts.require('./ACE.sol');
const ZkAsset = artifacts.require('./ZkAsset.sol');
const TestERC20 = artifacts.require('./TestERC20.sol');

module.exports = async (deployer, network) => {
  await deployer.deploy(TestERC20);
  const testERC20 = await TestERC20.deployed();

  let aceContract;
  if (network === 'development') {
    aceContract = await ACE.deployed();
    // initialise the ZkAsset
    await deployer.deploy(
      ZkAsset,
      aceContract.address,
      testERC20.address,
      1,
      false,
      true
    );
  }
};
