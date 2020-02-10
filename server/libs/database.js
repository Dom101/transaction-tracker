import Sequelize from 'sequelize';
import finale from 'finale-rest';

import Models from '../models';

const database = new Sequelize({
  dialect: 'sqlite',
  storage: './transaction-tracker.sqlite',
  operatorsAliases: false,
  logging: false,
});

const models = {
  Users: Models.users.init(database, Sequelize),
  Accounts: Models.accounts.init(database, Sequelize),
  Transactions: Models.transactions.init(database, Sequelize),
};

// Run `.associate` if it exists,
// ie create relationships in the ORM
Object.values(models)
  .filter((model) => typeof model.associate === 'function')
  .forEach((model) => model.associate(models));

export const db = {
  ...models,
  sequelize: database,
};

const initializeDatabase = async (app) => {
  finale.initialize({ app, sequelize: database });

  await database.sync();
};

export default initializeDatabase;
