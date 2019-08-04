import utils from "@aztec/dev-utils";

const aztec = require("aztec.js");
const dotenv = require("dotenv");
const ethers = require("ethers");
dotenv.config();
const secp256k1 = require("@aztec/secp256k1");

const iAge = artifacts.require("./IAge.sol");
const iLocation = artifacts.require("./ILocation.sol");
const iDegree = artifacts.require("./IDegree.sol");
const iBinary = artifacts.require("./IBinary.sol");
const iSalary = artifacts.require("./ISalary.sol");

const government = process.env.GANACHE_TESTING_ACCOUNT_5_ADDR;
const university = process.env.GANACHE_TESTING_ACCOUNT_6_ADDR;
const medicalLicenseBoard = process.env.GANACHE_TESTING_ACCOUNT_7_ADDR;
const hospital = process.env.GANACHE_TESTING_ACCOUNT_8_ADDR;
const bank = process.env.GANACHE_TESTING_ACCOUNT_9_ADDR;

const alicePrivKey = process.env.GANACHE_TESTING_ACCOUNT_1;
const alice = secp256k1.accountFromPrivateKey(alicePrivKey);

let aliceAgeNote,
  aliceLocationNote,
  aliceDegreeNote,
  aliceLicenseNote,
  aliceSalaryNote;

const age = 27;
const location = 560102;
const degree = 2;
const medicalLicense = 1;
const salary = 400000;

const {
  proofs: { MINT_PROOF, PRIVATE_RANGE_PROOF, DIVIDEND_PROOF }
} = utils;

contract("Government issuing Age Note", async accounts => {
  let ageContract,
    degreeContract,
    binaryContract,
    salaryContract,
    locationContract;

  beforeEach(async () => {
    ageContract = await iAge.deployed();
    degreeContract = await iDegree.deployed();
    binaryContract = await iBinary.deployed();
    salaryContract = await iSalary.deployed();
    locationContract = await iLocation.deployed();
  });

  it("allows government to mint age notes in alice's account", async () => {
    console.log(
      `[INFO] Government issuing note of value ${age} to alice with publice key ${alice.publicKey.slice(
        0,
        10
      )}...`
    );

    aliceAgeNote = await aztec.note.create(alice.publicKey, age);
    const newMintCounterNote = await aztec.note.create(alice.publicKey, age);
    const zeroMintCounterNote = await aztec.note.createZeroValueNote();
    const mintedNotes = [aliceAgeNote];

    const mintProof = new aztec.MintProof(
      zeroMintCounterNote,
      newMintCounterNote,
      mintedNotes,
      ageContract.address
    );

    const mintData = mintProof.encodeABI();
    await ageContract.register(MINT_PROOF, mintData, { from: government });
    console.log(
      `[INFO] The note minted has a hash ${aliceAgeNote.noteHash.slice(
        0,
        10
      )}...`
    );
  });

  it("allows university to mint degree notes in alice's account", async () => {
    console.log("[INFO] Degree Key -> Value");
    console.log("[INFO] No Education -> 0");
    console.log("[INFO] High School -> 1");
    console.log("[INFO] MBBS -> 2");
    console.log("[INFO] MD -> 3");
    console.log("[INFO] MD+ -> 4");
    console.log(
      `[INFO] University issuing note of value ${degree} to alice with publice key ${alice.publicKey.slice(
        0,
        10
      )}...`
    );

    aliceDegreeNote = await aztec.note.create(alice.publicKey, degree);
    const newMintCounterNote = await aztec.note.create(alice.publicKey, degree);
    const zeroMintCounterNote = await aztec.note.createZeroValueNote();
    const mintedNotes = [aliceDegreeNote];

    const mintProof = new aztec.MintProof(
      zeroMintCounterNote,
      newMintCounterNote,
      mintedNotes,
      degreeContract.address
    );

    const mintData = mintProof.encodeABI();
    await degreeContract.register(MINT_PROOF, mintData, { from: university });
    console.log(
      `[INFO] The note minted has a hash ${aliceDegreeNote.noteHash.slice(
        0,
        10
      )}...`
    );
  });

  it("allows medical license board to verify that alice qualified", async () => {
    let wallet = new ethers.Wallet(alicePrivKey);
    let message =
      "0xfa26db7ca85ead399216e7c6316bc50ed24393c3122b582735e7f3b0f91b93f0";

    let flatSig = await wallet.signMessage(message);
    let sig = ethers.utils.splitSignature(flatSig);

    const note1 = await aztec.note.create(alice.publicKey, 1);
    const note2 = await aztec.note.create(alice.publicKey, 1);
    const proof = new aztec.PrivateRangeProof(
      aliceDegreeNote,
      note1,
      note2,
      alice.address
    );
    const proofData = proof.encodeABI();

    console.log(
      `[INFO] user sending signature ${flatSig.slice(
        0,
        10
      )}... and proof data ${proofData.slice(0, 10)}...`
    );

    try {
      await degreeContract.validateOwnership(
        message,
        sig.v,
        sig.r,
        sig.s,
        aliceDegreeNote.noteHash
        // { from: medicalLicenseBoard }
      );
      await degreeContract.validateRange(PRIVATE_RANGE_PROOF, proofData, {
        from: alice.address
      });
      console.log(
        `[SUCCESS] medical license board verifies the degree condition`
      );
    } catch (err) {
      console.log("[ERROR] Verification Failed");
    }
  });

  it("allows medical license board to verify that alice is above a certain age", async () => {
    let wallet = new ethers.Wallet(alicePrivKey);
    let message =
      "0xfa26db7ca85ead399216e7c6316bc50ed24393c3122b582735e7f3b0f91b93f0";

    let flatSig = await wallet.signMessage(message);
    let sig = ethers.utils.splitSignature(flatSig);

    const note1 = await aztec.note.create(alice.publicKey, 25);
    const note2 = await aztec.note.create(alice.publicKey, 2);
    const proof = new aztec.PrivateRangeProof(
      aliceAgeNote,
      note1,
      note2,
      alice.address
    );
    const proofData = proof.encodeABI();

    console.log(
      `[INFO] user sending signature ${flatSig.slice(
        0,
        10
      )}... and proof data ${proofData.slice(0, 10)}...`
    );

    try {
      await ageContract.validateOwnership(
        message,
        sig.v,
        sig.r,
        sig.s,
        aliceAgeNote.noteHash
        // { from: medicalLicenseBoard }
      );
      await ageContract.validateRange(PRIVATE_RANGE_PROOF, proofData, {
        from: alice.address
      });
      console.log(`[SUCCESS] medical license board verifies the age condition`);
    } catch (err) {
      console.log("[ERROR] Verification Failed");
    }
  });

  it("allows medical license board to mint license note in alice's account", async () => {
    console.log("[INFO] Licese Key -> Value");
    console.log("[INFO] Not Licensed -> 0");
    console.log("[INFO] Has License -> 1");
    console.log(
      `[INFO] Medical issuing note of value ${medicalLicense} to alice with publice key ${alice.publicKey.slice(
        0,
        10
      )}...`
    );

    aliceLicenseNote = await aztec.note.create(alice.publicKey, medicalLicense);
    const newMintCounterNote = await aztec.note.create(
      alice.publicKey,
      medicalLicense
    );
    const zeroMintCounterNote = await aztec.note.createZeroValueNote();
    const mintedNotes = [aliceLicenseNote];

    const mintProof = new aztec.MintProof(
      zeroMintCounterNote,
      newMintCounterNote,
      mintedNotes,
      binaryContract.address
    );

    const mintData = mintProof.encodeABI();
    await binaryContract.register(MINT_PROOF, mintData, {
      from: medicalLicenseBoard
    });
    console.log(
      `[INFO] The note minted has a hash ${aliceLicenseNote.noteHash.slice(
        0,
        10
      )}...`
    );
  });

  it("allows hospital to verify that alice has medical license or not", async () => {
    let wallet = new ethers.Wallet(alicePrivKey);
    let message =
      "0xfa26db7ca85ead399216e7c6316bc50ed24393c3122b582735e7f3b0f91b93f0";

    let flatSig = await wallet.signMessage(message);
    let sig = ethers.utils.splitSignature(flatSig);

    const note1 = await aztec.note.create(alice.publicKey, 1);
    const note2 = await aztec.note.create(alice.publicKey, 0);
    const proof = new aztec.PrivateRangeProof(
      aliceLicenseNote,
      note1,
      note2,
      alice.address
    );
    const proofData = proof.encodeABI();

    console.log(
      `[INFO] user sending signature ${flatSig.slice(
        0,
        10
      )}... and proof data ${proofData.slice(0, 10)}...`
    );

    try {
      await binaryContract.validateOwnership(
        message,
        sig.v,
        sig.r,
        sig.s,
        aliceLicenseNote.noteHash
        // { from: hospital }
      );
      await binaryContract.validateRange(PRIVATE_RANGE_PROOF, proofData, {
        from: alice.address
      });
      console.log(`[SUCCESS] hospital verifies alice's medical license`);
    } catch (err) {
      console.log("[ERROR] Verification Failed");
    }
  });

  it("allows hospital to mint salary notes in alice's account", async () => {
    console.log(
      `[INFO] Hospital issuing note of value ${salary} to alice with publice key ${alice.publicKey.slice(
        0,
        10
      )}...`
    );

    aliceSalaryNote = await aztec.note.create(alice.publicKey, salary);
    const newMintCounterNote = await aztec.note.create(alice.publicKey, salary);
    const zeroMintCounterNote = await aztec.note.createZeroValueNote();
    const mintedNotes = [aliceSalaryNote];

    const mintProof = new aztec.MintProof(
      zeroMintCounterNote,
      newMintCounterNote,
      mintedNotes,
      salaryContract.address
    );

    const mintData = mintProof.encodeABI();
    await salaryContract.register(MINT_PROOF, mintData, { from: hospital });
    console.log(
      `[INFO] The note minted has a hash ${aliceSalaryNote.noteHash.slice(
        0,
        10
      )}...`
    );
  });

  it("allows bank to verify that alice has enough funds to be given a loan", async () => {
    let wallet = new ethers.Wallet(alicePrivKey);
    let message =
      "0xfa26db7ca85ead399216e7c6316bc50ed24393c3122b582735e7f3b0f91b93f0";

    let flatSig = await wallet.signMessage(message);
    let sig = ethers.utils.splitSignature(flatSig);

    const note1 = await aztec.note.create(alice.publicKey, 200000);
    const note2 = await aztec.note.create(alice.publicKey, 200000);
    const proof = new aztec.PrivateRangeProof(
      aliceSalaryNote,
      note1,
      note2,
      alice.address
    );
    const proofData = proof.encodeABI();

    console.log(
      `[INFO] user sending signature ${flatSig.slice(
        0,
        10
      )}... and proof data ${proofData.slice(0, 10)}...`
    );

    try {
      await salaryContract.validateOwnership(
        message,
        sig.v,
        sig.r,
        sig.s,
        aliceSalaryNote.noteHash,
        { from: hospital }
      );
      await binaryContract.validateRange(PRIVATE_RANGE_PROOF, proofData, {
        from: alice.address
      });
      console.log(`[SUCCESS] yay! alice got a loan`);
    } catch (err) {
      console.log("[ERROR] Verification Failed");
    }
  });
});
