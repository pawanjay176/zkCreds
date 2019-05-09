const ACE = artifacts.require('./ACE.sol');
const AdjustSupply = artifacts.require('./AdjustSupply.sol');
const BilateralSwap = artifacts.require('./BilateralSwap.sol');
const DividendComputation = artifacts.require('./DividendComputation.sol');
const JoinSplit = artifacts.require('./JoinSplit.sol');

const utils = require('@aztec/dev-utils');

const {
  constants,
  proofs: {
    JOIN_SPLIT_PROOF,
    MINT_PROOF,
    BILATERAL_SWAP_PROOF = '65794',
    DIVIDEND_COMPUTATION_PROOF = '66561'
  },
} = utils;

module.exports = async (deployer, network) => {
  if (network === 'development') {
    await deployer.deploy(ACE);
    await deployer.deploy(AdjustSupply);
    await deployer.deploy(BilateralSwap);
    await deployer.deploy(JoinSplit);
    await deployer.deploy(DividendComputation);
    const ACEContract = await ACE.deployed();
    const AdjustSupplyContract = await AdjustSupply.deployed();
    await ACEContract.setCommonReferenceString(constants.CRS);
    await ACEContract.setProof(MINT_PROOF, AdjustSupplyContract.address);
    await ACEContract.setProof(BILATERAL_SWAP_PROOF, BilateralSwap.address);
    await ACEContract.setProof(DIVIDEND_COMPUTATION_PROOF, DividendComputation.address);
    await ACEContract.setProof(JOIN_SPLIT_PROOF, JoinSplit.address);
  }
};
