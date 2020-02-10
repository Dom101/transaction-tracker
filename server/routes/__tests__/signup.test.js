import request from 'supertest';

import app from '../../app';
import { getToken } from '../../libs/truelayer';
import { createUserWithTransactions } from '../../libs/utils';
import env from '../../libs/env';

jest.mock('../../libs/database');
jest.mock('../../libs/env');
jest.mock('../../libs/truelayer');
jest.mock('../../libs/utils');

const config = {
  TRUELAYER_DOMAIN: 'test-domain',
  CLIENT_ID: 'id',
  REDIRECT_URI: 'uri',
  SERVER_PORT: 3003,
};
env.get.mockImplementation((key) => config[key]);

describe('/signup Endpoints', () => {
  it('should redirect to the auth endpoint', async () => {
    const res = await request(app)
      .get('/signup');
    expect(res.statusCode).toEqual(302);
    expect(res.headers.location).toEqual('https://auth.test-domain.com/?response_type=code&client_id=id&scope=info%20accounts%20balance%20cards%20transactions%20direct_debits%20offline_access&redirect_uri=uri&providers=uk-ob-all%20uk-oauth-all%20uk-cs-mock');
  });
});

describe('/callback Endpoint with multiple accounts', () => {
  let res;
  beforeAll(async () => {
    getToken.mockResolvedValue('TOKEN');
    createUserWithTransactions.mockResolvedValue({ id: 101, numberOfAccounts: 50, name: 'Test Guy' });
    res = await request(app)
      .get('/callback').query({ code: 'test' });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should get the users token', async () => {
    expect(getToken).toHaveBeenCalledTimes(1);
    expect(getToken).toHaveBeenCalledWith('test');
  });

  it('should create the user and transactions', async () => {
    expect(createUserWithTransactions).toHaveBeenCalledTimes(1);
    expect(createUserWithTransactions).toHaveBeenCalledWith('TOKEN');
  });

  it('should return the welcome message', async () => {
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual(`
      Welcome Test Guy!
      We've added 50 accounts
      Here's your UserID: 101
    `);
  });
});

describe('/callback Endpoint with a single account', () => {
  let res;
  beforeAll(async () => {
    getToken.mockResolvedValue('TOKEN');
    createUserWithTransactions.mockResolvedValue({ id: 10, numberOfAccounts: 1, name: 'Test Person' });
    res = await request(app)
      .get('/callback').query({ code: 'test' });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should get the users token', async () => {
    expect(getToken).toHaveBeenCalledTimes(1);
    expect(getToken).toHaveBeenCalledWith('test');
  });

  it('should create the user and transactions', async () => {
    expect(createUserWithTransactions).toHaveBeenCalledTimes(1);
    expect(createUserWithTransactions).toHaveBeenCalledWith('TOKEN');
  });

  it('should return the welcome message', async () => {
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual(`
      Welcome Test Person!
      We've added 1 account
      Here's your UserID: 10
    `);
  });
});

describe('/callback Endpoint when an error occurs', () => {
  let res;
  beforeAll(async () => {
    getToken.mockRejectedValue({ message: 'BAD ERROR' });
    createUserWithTransactions.mockResolvedValue({ id: 10, numberOfAccounts: 1, name: 'Test Person' });
    res = await request(app)
      .get('/callback').query({ code: 'test' });
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should get the users token', async () => {
    expect(getToken).toHaveBeenCalledTimes(1);
    expect(getToken).toHaveBeenCalledWith('test');
  });

  it('should not call the createUser function', async () => {
    expect(createUserWithTransactions).toHaveBeenCalledTimes(0);
  });

  it('should return the error message', async () => {
    expect(res.statusCode).toEqual(500);
    expect(res.text).toEqual(`
      Sorry there seems to have been a problem signing up
      Error: BAD ERROR
    `);
  });
});
