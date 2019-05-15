import utils from '@aztec/dev-utils';

const aztec = require('aztec.js');
const dotenv = require('dotenv');
dotenv.config();
const secp256k1 = require('@aztec/secp256k1');

const PrivateVenmo = artifacts.require('./contracts/PrivateVenmo.sol');
const JoinSplit = artifacts.require('@aztec/protocol/contracts/ACE/validators/joinSplit/JoinSplit.sol');

const {
  proofs: {
    JOIN_SPLIT_PROOF,
    MINT_PROOF,
  },
} = utils;


const demoScript = async() => {

  const privateVenmoContract = await PrivateVenmo.deployed();
  const joinSplitContract = await JoinSplit.deployed();

  const bob = secp256k1.accountFromPrivateKey(process.env.GANACHE_TESTING_ACCOUNT_2);

  const sally = secp256k1.accountFromPrivateKey(process.env.GANACHE_TESTING_ACCOUNT_1);

  const bobNote1 = await aztec.note.create(bob.publicKey, 100);
  const bobNote2 = await aztec.note.create(bob.publicKey, 50);

  const newTotalNote = await aztec.note.create(bob.publicKey, 150);
  const oldTotalNote = await aztec.note.createZeroValueNote();

  const {
    proofData: mintProofData,
  } = aztec.proof.mint.encodeMintTransaction({
    newTotalMinted: newTotalNote,
    oldTotalMinted: oldTotalNote,
    adjustedNotes: [bobNote1, bobNote2],
    senderAddress: bob.address,
  });

  await privateVenmoContract.confidentialMint(MINT_PROOF, mintProofData);

  console.log('Bob Deposited 150');



  // bob needs to pay sally for a taxi
  // the taxi is 25
  // if bob pays with his note worth 100 he requires 75 change
  //
  const sallyTaxiFee = await aztec.note.create(bob.publicKey, 25);

  const bobNote3 = await aztec.note.create(bob.publicKey, 75);



  const { proofData, expectedOutput, signatures } = aztec.proof.joinSplit.encodeJoinSplitTransaction({
    inputNotes: [bobBalance1],
    outputNotes: [sallyTaxiFee, bobNote3],
    senderAddress: bob.address,
    inputNoteOwners: [bob],
    publicOwner: bob.address,
    kPublic: 0,
    validatorAddress: joinSplitContract.address,
  });

  await privateVenmoContract.confidentialTransfer(proofData, signatures, {
    from: account.address,
  });

  console.log(
    'Bob paid sally 25 for the taxi'
  );
}

demoScript();
