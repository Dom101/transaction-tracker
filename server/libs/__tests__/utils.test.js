import { createUserWithTransactions } from '../utils';
import { db } from '../database';
import { getCards, getAccountTransactions, getAccounts } from '../truelayer';

jest.mock('../database', () => ({
  db: {
    Accounts: { create: jest.fn() },
    Users: { create: jest.fn() },
    Transactions: { create: jest.fn() },
  },
}));
jest.mock('../truelayer');

describe('Succesfully Creating A User With Multiple Transactions', () => {
  let result;
  const accounts = [
    {
      update_timestamp: '2017-02-07T17:29:24.740802Z',
      account_id: 'f1234560abf9f57287637624def390871',
      account_type: 'TRANSACTION',
      display_name: 'Club Lloyds',
      currency: 'GBP',
      account_number: {
        iban: 'GB35LOYD12345678901234',
        number: '12345678',
        sort_code: '12-34-56',
        swift_bic: 'LOYDGB2L',
      },
      provider: {
        display_name: 'Lloyds Bank',
        logo_uri: 'https://auth.truelayer.com/img/banks/banks-icons/lloyds-icon.svg',
        provider_id: 'lloyds',
      },
    },
  ];
  const cards = [
    {
      account_id: 'f7b093437032c216d4350b7d442b9c5ccc0e9f19',
      card_network: 'VISA',
      card_type: 'CREDIT',
      currency: 'GBP',
      display_name: 'Club Credit Card',
      partial_card_number: '0044',
      name_on_card: 'A. N. Other',
      valid_from: '2017-01',
      valid_to: '2018-01',
      update_timestamp: '2017-02-07T17:29:24.740802Z',
      provider: {
        display_name: 'Lloyds Bank',
        logo_uri: 'https://auth.truelayer.com/img/banks/banks-icons/lloyds-icon.svg',
        provider_id: 'lloyds',
      },
    },
  ];
  const transactions = [
    {
      transaction_id: '03c333979b729315545816aaa365c33f',
      timestamp: '2018-03-06T00:00:00',
      description: 'GOOGLE PLAY STORE',
      amount: -2.99,
      currency: 'GBP',
      transaction_type: 'DEBIT',
      transaction_category: 'PURCHASE',
      transaction_classification: [
        'Entertainment',
        'Games',
      ],
      merchant_name: 'Google play',
      running_balance: {
        amount: 1238.60,
        currency: 'GBP',
      },
      meta: {
        bank_transaction_id: '9882ks-00js',
        provider_transaction_category: 'DEB',
      },
    },
    {
      transaction_id: '3484333edb2078e77cf2ed58f1dec11e',
      timestamp: '2018-02-18T00:00:00',
      description: 'PAYPAL EBAY',
      amount: -25.25,
      currency: 'GBP',
      transaction_type: 'DEBIT',
      transaction_category: 'PURCHASE',
      transaction_classification: [
        'Shopping',
        'General',
      ],
      merchant_name: 'Ebay',
      meta: {
        bank_transaction_id: '33b5555724',
        provider_transaction_category: 'DEB',
      },
    },
  ];
  const token = 'TESTTOKEN';

  beforeAll(async () => {
    getAccounts.mockResolvedValue(accounts);
    getCards.mockResolvedValue(cards);
    getAccountTransactions.mockResolvedValue(transactions);
    db.Users.create.mockResolvedValue({ id: 5000, dataValues: { test: true } });
    db.Accounts.create.mockResolvedValue({ dataValues: { id: 123 } });
    db.Transactions.create.mockResolvedValue({ dataValues: { id: 5678 } });
    result = await createUserWithTransactions(token);
  });

  test('It should get the users account', async () => {
    expect(getAccounts).toHaveBeenCalled();
    expect(getAccounts).toHaveBeenCalledWith(token);
  });

  test('It should get the users cards', async () => {
    expect(getCards).toHaveBeenCalled();
    expect(getCards).toHaveBeenCalledWith(token);
  });

  test('It create the user in the database', async () => {
    expect(db.Users.create).toHaveBeenCalledTimes(1);
    expect(db.Users.create).toHaveBeenCalledWith({
      name: 'A. N. Other',
    });
  });

  test('It should add one account to the database', async () => {
    expect(db.Accounts.create).toHaveBeenCalledTimes(1);
    expect(db.Accounts.create).toHaveBeenCalledWith({
      UserId: 5000,
      account_iban: 'GB35LOYD12345678901234',
      account_id: 'f1234560abf9f57287637624def390871',
      account_number: '12345678',
      account_sort_code: '12-34-56',
      account_type: 'TRANSACTION',
      currency: 'GBP',
      display_name: 'Club Lloyds',
      provider: 'Lloyds Bank',
    });
  });

  test('It should get the users transactions', async () => {
    expect(getAccountTransactions).toHaveBeenCalled();
    expect(getAccountTransactions).toHaveBeenCalledWith(token, accounts[0]);
  });

  test('It should save the 2 transactions', async () => {
    expect(db.Transactions.create).toHaveBeenCalledTimes(2);
    expect(db.Transactions.create).toHaveBeenNthCalledWith(1, {
      AccountId: 123,
      amount: -2.99,
      description: 'GOOGLE PLAY STORE',
      running_balance_amount: 1238.6,
      running_balance_currency: 'GBP',
      timestamp: '2018-03-06T00:00:00',
      transaction_category: 'PURCHASE',
      transaction_id: '03c333979b729315545816aaa365c33f',
      transaction_type: 'DEBIT',
    });
    expect(db.Transactions.create).toHaveBeenNthCalledWith(2, {
      AccountId: 123,
      amount: -25.25,
      description: 'PAYPAL EBAY',
      running_balance_amount: null,
      running_balance_currency: null,
      timestamp: '2018-02-18T00:00:00',
      transaction_category: 'PURCHASE',
      transaction_id: '3484333edb2078e77cf2ed58f1dec11e',
      transaction_type: 'DEBIT',
    });
  });

  test('It should return the user data', async () => {
    expect(result).toEqual({
      test: true,
      numberOfAccounts: 1,
    });
  });
});
