import utils from '@aztec/dev-utils';

const aztec = require('aztec.js');
const dotenv = require('dotenv');
dotenv.config();
const secp256k1 = require('@aztec/secp256k1');

// const PrivateVenmo = artifacts.require('./PrivateVenmo.sol');
const ZkAssetMintable = artifacts.require('./ZkAssetMintable.sol');
const JoinSplit = artifacts.require('@aztec/protocol/contracts/ACE/validators/joinSplit/JoinSplit.sol');

const {
  proofs: {
    JOIN_SPLIT_PROOF,
    MINT_PROOF,
  },
} = utils;


contract('PrivateVenmo', async (accounts) => {

  const bob = secp256k1.accountFromPrivateKey(process.env.GANACHE_TESTING_ACCOUNT_0);
  const sally = secp256k1.accountFromPrivateKey(process.env.GANACHE_TESTING_ACCOUNT_1);
  let privateVenmoContract;
  let joinSplitContract;
  let bobNote1;
  let bobNote2;
  beforeEach(async () => {
    privateVenmoContract = await ZkAssetMintable.deployed();
    joinSplitContract = await JoinSplit.deployed();
  });

  it('Bob should be able to deposit 100 then pay sally 25 by splitting notes he owns', async() => {
    
    console.log('Bob wants to deposit 100');
    bobNote1 = await aztec.note.create(bob.publicKey, 100);


    const newTotalNote = await aztec.note.create(bob.publicKey, 100);
    const oldTotalNote = await aztec.note.createZeroValueNote();

    const {
      proofData: mintProofData,
    } = aztec.proof.mint.encodeMintTransaction({
      newTotalMinted: newTotalNote,
      oldTotalMinted: oldTotalNote,
      adjustedNotes: [bobNote1],
      senderAddress: privateVenmoContract.address,
    });

    // the person who validates the proof

    await privateVenmoContract.setProofs(1, -1, {from: accounts[0]});
    await privateVenmoContract.confidentialMint(MINT_PROOF, mintProofData, {from: accounts[0]});

    console.log('Bob succesffully deposited 190');

    // bob needs to pay sally for a taxi
    // the taxi is 25
    // if bob pays with his note worth 100 he requires 75 change
    //
    console.log('Bob takes a taxi, Sally is the driver');
    const sallyTaxiFee = await aztec.note.create(sally.publicKey, 25);

    console.log('The fare comes to 25');
    const bobNote2 = await aztec.note.create(bob.publicKey, 75);
    console.log(bob);
    console.log(bobNote1.owner);


    const { proofData, expectedOutput, signatures } = aztec.proof.joinSplit.encodeJoinSplitTransaction({
      inputNotes: [bobNote1],
      outputNotes: [sallyTaxiFee, bobNote2],
      senderAddress: accounts[0],
      inputNoteOwners: [bob],
      publicOwner: accounts[0],
      kPublic: 0,
      validatorAddress: privateVenmoContract.address,
    });

    await privateVenmoContract.confidentialTransfer(proofData, signatures, {
      from: accounts[0],
    });
    
    console.log(
      'Bob paid sally 25 for the taxi and gets 75 back'
    );

  })


});

