const ACE = artifacts.require('./ACE.sol');
const JoinSplitFluid = artifacts.require('./JoinSplitFluid.sol');
const Swap = artifacts.require('./Swap.sol');
const Dividend = artifacts.require('./Dividend.sol');
const PrivateRange = artifacts.require('./PrivateRange.sol');
const JoinSplit = artifacts.require('./JoinSplit.sol');

const utils = require('@aztec/dev-utils');
const bn128 = require('')

H_X = new BN('7673901602397024137095011250362199966051872585513276903826533215767972925880', 10);
H_Y = new BN('8489654445897228341090914135473290831551238522473825886865492707826370766375', 10);
t2 = [
    '0x01cf7cc93bfbf7b2c5f04a3bc9cb8b72bbcf2defcabdceb09860c493bdf1588d',
    '0x08d554bf59102bbb961ba81107ec71785ef9ce6638e5332b6c1a58b87447d181',
    '0x204e5d81d86c561f9344ad5f122a625f259996b065b80cbbe74a9ad97b6d7cc2',
    '0x02cb2a424885c9e412b94c40905b359e3043275cd29f5b557f008cd0a3e0c0dc',
];
const CRS = [`0x${H_X.toString(16)}`, `0x${H_Y.toString(16)}`, ...t2];

const {
  proofs: {
    JOIN_SPLIT_PROOF,
    MINT_PROOF,
    SWAP_PROOF,
    DIVIDEND_PROOF,
    PRIVATE_RANGE_PROOF,
  },
} = utils;


module.exports = async (deployer, network) => {
  if (network === 'development') {
    await deployer.deploy(ACE);
    await deployer.deploy(JoinSplitFluid);
    await deployer.deploy(Swap);
    await deployer.deploy(JoinSplit);
    await deployer.deploy(PrivateRange);

    await deployer.deploy(Dividend);
    const ACEContract = await ACE.deployed();
    const JoinSplitFluidContract = await JoinSplitFluid.deployed();
    await ACEContract.setCommonReferenceString(CRS);
    await ACEContract.setProof(MINT_PROOF, JoinSplitFluidContract.address);
    await ACEContract.setProof(SWAP_PROOF, Swap.address);
    await ACEContract.setProof(DIVIDEND_PROOF, Dividend.address);
    await ACEContract.setProof(JOIN_SPLIT_PROOF, JoinSplit.address);
    await ACEContract.setProof(PRIVATE_RANGE_PROOF, PrivateRange.address);
  }
};
