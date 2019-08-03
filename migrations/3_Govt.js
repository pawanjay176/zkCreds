const ACE = artifacts.require('./ACE.sol');
const Govt = artifacts.require('./Govt.sol');

module.exports = async (deployer, network) => {

  let aceContract;
  if (network === 'development') {
    aceContract = await ACE.deployed();
    await deployer.deploy(
      IAge,
      aceContract.address,
      '0x0000000000000000000000000000000000000000',
      1
    );
    await deployer.deploy(
      IBinary,
      aceContract.address,
      '0x0000000000000000000000000000000000000000',
      1
    );
    await deployer.deploy(
      ILocation,
      aceContract.address,
      '0x0000000000000000000000000000000000000000',
      1
    );
    await deployer.deploy(
      ISalary,
      aceContract.address,
      '0x0000000000000000000000000000000000000000',
      1
    );
    await deployer.deploy(
      IDegree,
      aceContract.address,
      '0x0000000000000000000000000000000000000000',
      1
    );
  }
};
