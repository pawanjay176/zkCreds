const ACE = artifacts.require('./ACE.sol');
const Govt = artifacts.require('./Govt.sol');

module.exports = async (deployer, network) => {

  let aceContract;
  if (network === 'development') {
    aceContract = await ACE.deployed();
    await deployer.deploy(
      Govt,
      aceContract.address,
      '0x0000000000000000000000000000000000000000',
      1
    );
  }
};
