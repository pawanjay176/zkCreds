var utils = require("@aztec/dev-utils");
const ethers = require("ethers");
const aztec = require("aztec.js");
const dotenv = require("dotenv");
dotenv.config();
var iAge = artifacts.require("iAge");

const {
  proofs: { MINT_PROOF }
} = utils;

const { MintProof } = aztec;

module.exports = async function(callback) {
  const publicKey = process.argv[4];
  const value = process.argv[5];

  console.log(`[INFO] Issuing note of value ${value} to ${publicKey}`);

  let iAge;
  iAge = await iAge.deployed();

  const userNote = await aztec.note.create(publicKey, value);
  const newMintCounterNote = await aztec.note.create(publicKey, value);
  const zeroMintCounterNote = await aztec.note.createZeroValueNote();
  const mintedNotes = [userNote];

  const sender = govt.address;

  const mintProof = new MintProof(
    zeroMintCounterNote,
    newMintCounterNote,
    mintedNotes,
    sender
  );

  const mintData = mintProof.encodeABI();
  console.log(`[INFO] The note minted has a hash ${userNote.noteHash}`);
  a = await iAge.register(MINT_PROOF, mintData, sender);

  govt.on("UpdateTotalMinted", function(noteHash, metadata) {
    console.log(noteHash, metadata);
  });
};
