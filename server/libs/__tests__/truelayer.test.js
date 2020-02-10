import got from 'got';
import {
  getAccounts, getAccountTransactions, getToken, getCards,
} from '../truelayer';
import env from '../env';

jest.mock('got');
jest.mock('../env');


describe('Get Accounts', () => {
  let result;
  beforeAll(async () => {
    const returnData = {
      results: { test: true },
    };
    const config = {
      TRUELAYER_DOMAIN: 'test-domain',
    };
    env.get.mockImplementation((key) => config[key]);
    got.mockResolvedValue({ body: JSON.stringify(returnData) });
    result = await getAccounts('TESTTOKEN');
  });

  test('It calls the truelayer api', () => {
    expect(got).toHaveBeenCalled();
    expect(got).toHaveBeenCalledWith('data/v1/accounts', {
      prefixUrl: 'https://api.test-domain.com',
      headers: {
        Authorization: 'Bearer TESTTOKEN',
      },
    });
  });

  test('It returns the account result', () => {
    expect(result).toEqual({ test: true });
  });
});

describe('Get Cards', () => {
  let result;
  beforeAll(async () => {
    const returnData = {
      results: { cards: true },
    };
    const config = {
      TRUELAYER_DOMAIN: 'test-domain',
    };
    env.get.mockImplementation((key) => config[key]);
    got.mockResolvedValue({ body: JSON.stringify(returnData) });
    result = await getCards('TESTTOKEN');
  });

  test('It calls the truelayer api', () => {
    expect(got).toHaveBeenCalled();
    expect(got).toHaveBeenCalledWith('data/v1/cards', {
      prefixUrl: 'https://api.test-domain.com',
      headers: {
        Authorization: 'Bearer TESTTOKEN',
      },
    });
  });

  test('It returns the transaction result', () => {
    expect(result).toEqual({ cards: true });
  });
});

describe('Get Account Transactions', () => {
  let result;
  beforeAll(async () => {
    const returnData = {
      results: { test: true },
    };
    const config = {
      TRUELAYER_DOMAIN: 'test-domain',
    };
    env.get.mockImplementation((key) => config[key]);
    got.mockResolvedValue({ body: JSON.stringify(returnData) });
    result = await getAccountTransactions('TESTTOKEN', { account_id: 'ACCOUNT' });
  });

  test('It calls the truelayer api', () => {
    expect(got).toHaveBeenCalled();
    expect(got).toHaveBeenCalledWith('data/v1/accounts/ACCOUNT/transactions', {
      prefixUrl: 'https://api.test-domain.com',
      headers: {
        Authorization: 'Bearer TESTTOKEN',
      },
    });
  });

  test('It returns the transaction result', () => {
    expect(result).toEqual({ test: true });
  });
});

describe('Get Token', () => {
  let result;
  beforeAll(async () => {
    const returnData = {
      access_token: '1234567890',
    };
    const config = {
      TRUELAYER_DOMAIN: 'test-domain',
      CLIENT_SECRET: 'shhhhh',
      CLIENT_ID: 'client1',
      REDIRECT_URI: 'google.com',
    };
    env.get.mockImplementation((key) => config[key]);
    got.post.mockResolvedValue({ body: JSON.stringify(returnData) });
    result = await getToken('TESTCODE');
  });

  test('It calls the truelayer api', () => {
    expect(got.post).toHaveBeenCalled();
    expect(got.post).toHaveBeenCalledWith('connect/token', {
      prefixUrl: 'https://auth.test-domain.com',
      form: {
        client_id: 'client1',
        client_secret: 'shhhhh',
        code: 'TESTCODE',
        grant_type: 'authorization_code',
        redirect_uri: 'google.com',
      },
    });
  });

  test('It returns the user token', () => {
    expect(result).toEqual('1234567890');
  });
});
