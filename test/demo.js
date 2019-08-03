import utils from '@aztec/dev-utils';
import { keccak256 } from 'ethers/utils';

const aztec = require('aztec.js');
const dotenv = require('dotenv');
const ethers = require('ethers');
dotenv.config();
const secp256k1 = require('@aztec/secp256k1');
const { errors } = require('@aztec/dev-utils');
// const secp256k1 = require('@aztec/secp256k1');
const { expect } = require('chai');
const { randomHex } = require('web3-utils');

// const note = require('../../../src/note');

// const PrivateVenmo = artifacts.require('./PrivateVenmo.sol');
const ZkAssetMintable = artifacts.require('./ZkAssetMintable.sol');
const Govt = artifacts.require('./Govt.sol');
const JoinSplit = artifacts.require('@aztec/protocol/contracts/ACE/validators/joinSplit/JoinSplit.sol');

const {
  proofs: {
    MINT_PROOF,
    PRIVATE_RANGE_PROOF,
  },
} = utils;

const { JoinSplitProof, MintProof } = aztec;

contract('Private payment', async (accounts) => {

  const bob = secp256k1.accountFromPrivateKey(process.env.GANACHE_TESTING_ACCOUNT_0);
  const sally = secp256k1.accountFromPrivateKey(process.env.GANACHE_TESTING_ACCOUNT_1);
  let govt;

  beforeEach(async () => {
    govt = await Govt.deployed();
  });

  it('MyTest', async() => {
    console.log("Start");
    const bobNote1 = await aztec.note.create(bob.publicKey, 100);

    const newMintCounterNote = await aztec.note.create(bob.publicKey, 100);
    const zeroMintCounterNote = await aztec.note.createZeroValueNote();
    const sender = govt.address;
    const mintedNotes = [bobNote1];

    const mintProof = new MintProof(
      zeroMintCounterNote,
      newMintCounterNote,
      mintedNotes,
      sender,
    );

    const mintData = mintProof.encodeABI();

    // await privatePaymentContract.setProofs(1, -1, {from: accounts[0]});
    await govt.register(MINT_PROOF, mintData, {from: accounts[0]});
    
    console.log('Bob succesffully deposited 100');

    // Signature verification
    let privateKey = "0x60cd6638b6578d0bced19e5d8673d15a8d3a148136e914ea442b1cc9fd0970a2";
    let wallet = new ethers.Wallet(privateKey);

    let message = "0xfa26db7ca85ead399216e7c6316bc50ed24393c3122b582735e7f3b0f91b93f0";

    // Sign the string message
    let flatSig = await wallet.signMessage(message);

    // For Solidity, we need the expanded-format of a signature
    let sig = ethers.utils.splitSignature(flatSig);
    let recovered = await govt.validateOwnership(message, sig.v, sig.r, sig.s, bobNote1.noteHash);
    console.log("Done", recovered);
    // Range proof

    const note1 = await aztec.note.create(bob.publicKey, 25);
    const note2 = await aztec.note.create(bob.publicKey, 5);
    const note3 = await aztec.note.create(bob.publicKey, 20);
    const proof = new aztec.PrivateRangeProof(note1, note2, note3, bob.address);
    console.log("Proof ", proof.encodeABI());
    
    let data = await govt.validateRange(PRIVATE_RANGE_PROOF, proof.encodeABI());
    console.log(data);
  })

  // it('Bob should be able to deposit 100 then pay sally 25 by splitting notes he owns', async() => {
    
  //   console.log('Bob wants to deposit 100');
  //   const bobNote1 = await aztec.note.create(bob.publicKey, 100);

  //   const newMintCounterNote = await aztec.note.create(bob.publicKey, 100);
  //   const zeroMintCounterNote = await aztec.note.createZeroValueNote();
  //   const sender = privatePaymentContract.address;
  //   const mintedNotes = [bobNote1];

  //   const mintProof = new MintProof(
  //     zeroMintCounterNote,
  //     newMintCounterNote,
  //     mintedNotes,
  //     sender,
  //   );

  //   const mintData = mintProof.encodeABI();

  //   // await privatePaymentContract.setProofs(1, -1, {from: accounts[0]});
  //   await privatePaymentContract.confidentialMint(MINT_PROOF, mintData, {from: accounts[0]});

  //   console.log('Bob succesffully deposited 100');

  //   // bob needs to pay sally for a taxi
  //   // the taxi is 25
  //   // if bob pays with his note worth 100 he requires 75 change
  //   console.log('Bob takes a taxi, Sally is the driver');
  //   const sallyTaxiFee = await aztec.note.create(sally.publicKey, 25);


  //   console.log('The fare comes to 25');
  //   const bobNote2 = await aztec.note.create(bob.publicKey, 75);
  //   const sendProofSender = accounts[0];
  //   const withdrawPublicValue = 0;
  //   const publicOwner = accounts[0];

  //   const sendProof = new JoinSplitProof(
  //       mintedNotes,
  //       [sallyTaxiFee, bobNote2],
  //       sendProofSender,
  //       withdrawPublicValue,
  //       publicOwner
  //   );
  //   const sendProofData = sendProof.encodeABI(privatePaymentContract.address);
  //   const sendProofSignatures = sendProof.constructSignatures(privatePaymentContract.address, [bob])
  //   await privatePaymentContract.confidentialTransfer(sendProofData, sendProofSignatures, {
  //     from: accounts[0],
  //   });
    
  //   console.log(
  //     'Bob paid sally 25 for the taxi and gets 75 back'
  //   );

  // })
});

