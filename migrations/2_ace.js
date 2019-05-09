const ACE = artifacts.require('@aztec/protocol/contracts/ACE/ACE.sol');
const AdjustSupply = artifacts.require('@aztec/protocol/contracts/ACE/validators/adjustSupply/AdjustSupply.sol');
const BilateralSwap = artifacts.require('@aztec/protocol/contracts/ACE/validators/bilateralSwap/BilateralSwap.sol');
const DividendComputation = artifacts.require('@aztec/protocol/contracts/ACE/validators/dividendComputation/DividendComputation.sol');
const JoinSplit = artifacts.require('@aztec/protocol/contracts/ACE/validators/joinSplit/JoinSplit.sol');

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
