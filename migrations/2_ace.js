const ACE = artifacts.require('./ACE.sol');
const AdjustSupply = artifacts.require('./AdjustSupply.sol');
const BilateralSwap = artifacts.require('./BilateralSwap.sol');
const DividendComputation = artifacts.require('./DividendComputation.sol');
const PrivateRange = artifacts.require('./PrivateRange.sol');
const JoinSplit = artifacts.require('./JoinSplit.sol');

const utils = require('@aztec/dev-utils');

const {
  constants,
  proofs: {
    JOIN_SPLIT_PROOF,
    MINT_PROOF,
    BILATERAL_SWAP_PROOF,
    DIVIDEND_PROOF,
    PRIVATE_RANGE_PROOF,
  },
} = utils;


module.exports = async (deployer, network) => {
  if (network === 'development') {
    await deployer.deploy(ACE);
    await deployer.deploy(AdjustSupply);
    await deployer.deploy(BilateralSwap);
    await deployer.deploy(JoinSplit);
    await deployer.deploy(PrivateRange);

    await deployer.deploy(DividendComputation);
    const ACEContract = await ACE.deployed();
    const AdjustSupplyContract = await AdjustSupply.deployed();
    await ACEContract.setCommonReferenceString(constants.CRS);
    await ACEContract.setProof(MINT_PROOF, AdjustSupplyContract.address);
    await ACEContract.setProof(BILATERAL_SWAP_PROOF, BilateralSwap.address);
    await ACEContract.setProof(DIVIDEND_PROOF, DividendComputation.address);
    await ACEContract.setProof(JOIN_SPLIT_PROOF, JoinSplit.address);
    await ACEContract.setProof(PRIVATE_RANGE_PROOF, PrivateRange.address);
  }
};
