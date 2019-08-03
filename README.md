# zkCreds

## Credential verification with no data leakage
The Problem it solves
DESCRIBE WHAT CAN PEOPLE USE IT FOR, OR HOW IT MAKES EXISTING TASKS EASIER/SAFER E.T.C

In the current systems if we want to prove some data or presense of data then we are almost always required to submit excess data. Like if you are going to watch a R Rated movie then the only thing required would be 

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


