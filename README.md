# ETH India Project

## Verifying ownership through ZKP (without revealing anything)

Built on top of Aztec Protocol.

### Getting started

1. Clone this repository `git clone git@github.com:pawanjay176/AztecDemo.git`

2. Install the dependencies `cd aztec-ganache-starter-kit && yarn install`

3. Rename the `.env` file  `mv RENAME_ME.env .env`

4. Start up Ganache `yarn start` (This will create 5 test ethereum accounts from the credentials in `.env`)

5. Compile the contracts `truffle compile --all`

6. Deploy AZTEC! `yarn migrate`

7. Run the private payment demo. `truffle test test/demo.js`


## Identities
- Govt.Age
- Govt.Pincode
- Employer.AnnualSalary
- University.HighestEducation (High School = 0, (B.Tech, B.A) = 1, (iM.Tech, MS, M.Tech) = 2, PhD = 3)
- BinaryAssets (Verified Phone No or not, Driving License or not)


