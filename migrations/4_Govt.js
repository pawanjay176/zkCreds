const ACE = artifacts.require('./ACE.sol');
// const ZkAsset = artifacts.require('./ZkAsset.sol');
const Govt = artifacts.require('./Govt.sol');

module.exports = async (deployer, network) => {

  let aceContract;
  if (network === 'development') {
    aceContract = await ACE.deployed();
    // initialise the ZkAsset with an ERC20 equivilant
    await deployer.deploy(
      Govt,
      aceContract.address,
      '0x0000000000000000000000000000000000000000',
      1
    );

    // // initialise the private asset 
    // await deployer.deploy(ZkAssetMintable,
    //   aceContract.address,
    //   '0x0000000000000000000000000000000000000000',
    //   1,
    // );
  }
};
