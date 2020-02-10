# Transaction Tracker
POC to store users bank accounts and transactions

### About

This is a NodeJs Express Server that will connect to the True Layer API and store account and transaction information.\
It is not intended for production use as sensitive data is currently stored as plain text!\
It uses the oath protocol to connect to TrueLayer, once authorized it will download the users accounts and transactions for the last 3 months. These can be accesed from the provided REST API.

### API

**/signup** - `http://localhost:3000/signup` \
This will redirect to the TrueLayer auth page, once authorized you will be redirected back to the server which will save your information and provide you with your user id

**/users/:id** - `http://localhost:3000/users/10` \
Returns the User for the given id

**/users/:id/accounts** - `http://localhost:3000/users/10/accounts` \
Returns all the accounts for a given user

**/users/:id/accounts/transactions** - `http://localhost:3000/users/10/accounts/transactions` \
Returns all the transactions for all the accounts for a given user

**/users/:id/accounts/:id/transactions** - `http://localhost:3000/users/10/accounts/20` \
Returns all the transactions for a given account

### Database

The data retrieved from TrueLayer is stored in an SQL Lite database.\
Sequelize is used as wrapper which is a promise based ORM and supports multiple SQL dialects\
The data is stored in 3 tables **Users** **Accounts** **Transactions**
* Users table stores the name of the user
* Accounts table stores all of the account data from TrueLayer and the UserID
* Transactions table stores all of the transaction data from TrueLayer and the AccountID

### Running the server

#### Prerequisites
Before you start, you will need:
* [Node.js and Node Package Manager (NPM)](https://nodejs.org/download/)
* [Yarn](https://classic.yarnpkg.com/en/docs/install)

#### Steps
1. Install the dependencies
```bash
$ yarn
```
2. Create a **.env** config file in the route of the project using this template
```dosini
CLIENT_ID=sandbox
CLIENT_SECRET=secret
REDIRECT_URI=http://localhost:3000/callback
TRUELAYER_AUTH_URL=https://auth.truelayer.com
TRUELAYER_DOMAIN=truelayer-sandbox
```
3. Start the server
```bash
$ yarn start
```
This will automatically create the database if it doesn't exist and start listening on port 3000 by default

### Improvements
- Add authentication to secure routes
- Expand on the api to add more routes 
- Encrypt data on the database
- Modify behaviour on signup so it's not all in one request
- Add CI workflow to test, build and deploy
- Add multiple environments and branches
- Add UI
