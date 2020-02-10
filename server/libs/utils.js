import { db } from './database';
import { getCards, getAccountTransactions, getAccounts } from './truelayer';

export async function addCard(user, card) {
  const newCard = await db.Cards.create({
    account_id: card.account_id,
    card_network: card.card_network,
    card_type: card.card_type,
    currency: card.currency,
    partial_card_number: card.partial_card_number,
    display_name: card.display_name,
    provider: card.provider.display_name,
    UserId: user.id,
  });

  return newCard.dataValues;
}

export async function addAccount(user, account) {
  const newAccount = await db.Accounts.create({
    account_id: account.account_id,
    display_name: account.display_name,
    provider: account.provider.display_name,
    account_type: account.account_type,
    currency: account.currency,
    account_number: account.account_number.number,
    account_iban: account.account_number.iban,
    account_sort_code: account.account_number.sort_code,
    UserId: user.id,
  });

  return newAccount.dataValues;
}

export async function addTransaction(account, transaction) {
  return db.Transactions.create({
    transaction_id: transaction.transaction_id,
    timestamp: transaction.timestamp,
    description: transaction.description,
    transaction_type: transaction.transaction_type,
    transaction_category: transaction.transaction_category,
    amount: transaction.amount,
    running_balance_amount: transaction.running_balance ? transaction.running_balance.amount : null,
    running_balance_currency:
      transaction.running_balance ? transaction.running_balance.currency : null,
    AccountId: account.id,
  });
}

export async function addMultipleTransactions(account, transactions) {
  transactions.forEach(async (transaction) => {
    await addTransaction(account, transaction);
  });
}

export async function addAccountsAndTransactions(user, accounts, token) {
  accounts.forEach(async (account) => {
    const accountData = await addAccount(user, account);
    const transactions = await getAccountTransactions(token, account);
    await addMultipleTransactions(accountData, transactions);
  });
}

export async function createUserWithTransactions(token) {
  const accounts = await getAccounts(token);
  const cards = await getCards(token); // TODO store the cards as well

  if (!accounts.length) {
    throw new Error('Looks like you dont have any accounts');
  }

  const user = await db.Users.create({
    name: cards[0] ? cards[0].name_on_card : null, // Setting name from first card
  });

  await addAccountsAndTransactions(user, accounts, token);

  return {
    ...user.dataValues,
    numberOfAccounts: accounts.length,
  };
}
