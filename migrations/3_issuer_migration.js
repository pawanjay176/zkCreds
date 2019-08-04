const ACE = artifacts.require('./ACE.sol');
const IAge = artifacts.require('./IAge.sol');
const IBinary = artifacts.require('./IBinary.sol');
const ILocation = artifacts.require('./ILocation.sol');
const ISalary = artifacts.require('./ISalary.sol');
const IDegree = artifacts.require('./IDegree.sol');

module.exports = async (deployer, network) => {

  let aceContract;
  if (network === 'development') {
    aceContract = await ACE.deployed();
    await deployer.deploy(
      IAge,
      aceContract.address,
      '0x0000000000000000000000000000000000000000',
      1,
      // govt address 0xCFC1e6FC821251A8D917616ac514d3E1677a5D24
      { from: "0xCFC1e6FC821251A8D917616ac514d3E1677a5D24" }
    );
    await deployer.deploy(
      IBinary,
      aceContract.address,
      '0x0000000000000000000000000000000000000000',
      1,
      // medical board add 0x8cf52Bd739185299572a29899f6156da8A91426e
      { from: "0x8cf52Bd739185299572a29899f6156da8A91426e" }
    );
    await deployer.deploy(
      ILocation,
      aceContract.address,
      '0x0000000000000000000000000000000000000000',
      1,
      // govt address 0xCFC1e6FC821251A8D917616ac514d3E1677a5D24
      { from: "0xCFC1e6FC821251A8D917616ac514d3E1677a5D24" }
    );
    await deployer.deploy(
      ISalary,
      aceContract.address,
      '0x0000000000000000000000000000000000000000',
      1,
      // hospital add 0xB8E6c59934720121f6FE69263fe7a5002EaDF32A
      { from: "0xB8E6c59934720121f6FE69263fe7a5002EaDF32A" }
    );
    await deployer.deploy(
      IDegree,
      aceContract.address,
      '0x0000000000000000000000000000000000000000',
      1,
      // university add 0x60A1F4CF36B22BDC3abB397AC0d67933833E4229
      { from: "0x60A1F4CF36B22BDC3abB397AC0d67933833E4229" }
    );
  }
};
