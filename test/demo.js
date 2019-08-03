import utils from "@aztec/dev-utils";
import { keccak256 } from "ethers/utils";

const aztec = require("aztec.js");
const dotenv = require("dotenv");
const ethers = require("ethers");
dotenv.config();
const secp256k1 = require("@aztec/secp256k1");
const Govt = artifacts.require("./ISalary.sol");

const {
  proofs: { MINT_PROOF, PRIVATE_RANGE_PROOF, DIVIDEND_PROOF }
} = utils;

const { MintProof } = aztec;

contract("Govt", async accounts => {
  const bob = secp256k1.accountFromPrivateKey(
    process.env.GANACHE_TESTING_ACCOUNT_0
  );
  let govt;

  beforeEach(async () => {
    govt = await Govt.deployed();
  });

  it("flow", async () => {
    const bobNote1 = await aztec.note.create(bob.publicKey, 100);

    const newMintCounterNote = await aztec.note.create(bob.publicKey, 100);
    const zeroMintCounterNote = await aztec.note.createZeroValueNote();
    const sender = govt.address;
    const mintedNotes = [bobNote1];

    const mintProof = new MintProof(
      zeroMintCounterNote,
      newMintCounterNote,
      mintedNotes,
      sender
    );

    const mintData = mintProof.encodeABI();

    // await privatePaymentContract.setProofs(1, -1, {from: accounts[0]});
    await govt.register(MINT_PROOF, mintData, { from: accounts[0] });

    // Signature verification
    let privateKey =
      "0x60cd6638b6578d0bced19e5d8673d15a8d3a148136e914ea442b1cc9fd0970a2";
    let wallet = new ethers.Wallet(privateKey);

    let message =
      "0xfa26db7ca85ead399216e7c6316bc50ed24393c3122b582735e7f3b0f91b93f0";

    // Sign the string message
    let flatSig = await wallet.signMessage(message);

    // For Solidity, we need the expanded-format of a signature
    let sig = ethers.utils.splitSignature(flatSig);
    await govt.validateOwnership(
      message,
      sig.v,
      sig.r,
      sig.s,
      bobNote1.noteHash
    );

    // Range proof
    const note1 = await aztec.note.create(bob.publicKey, 25);
    const note2 = await aztec.note.create(bob.publicKey, 5);
    const note3 = await aztec.note.create(bob.publicKey, 20);
    const proof = new aztec.PrivateRangeProof(note1, note2, note3, bob.address);

    await govt.validateRange(PRIVATE_RANGE_PROOF, proof.encodeABI());

    // Dividend proof
    
    // target <= (zb/za) * notional
    const notional = await aztec.note.create(bob.publicKey, 900000); //loan amount
    const residual = await aztec.note.create(bob.publicKey, 40000); //rounding error
    const target = await aztec.note.create(bob.publicKey, 500000); // alice's salary
    const za = 100;
    const zb = 5;
    const proofDividend = new aztec.DividendProof(
      notional,
      residual,
      target,
      bob.address,
      za,
      zb
    );
    
    console.log("Created proof ", proofDividend);

    await govt.validateRatio(DIVIDEND_PROOF, proofDividend.encodeABI());
    console.log("Sab mangalmay");
  });
});
