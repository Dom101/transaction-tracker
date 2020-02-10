import got from 'got';

import env from './env';

export async function getToken(code) {
  const authOptions = {
    client_id: env.get('CLIENT_ID'),
    client_secret: env.get('CLIENT_SECRET'),
    code,
    grant_type: 'authorization_code',
    redirect_uri: env.get('REDIRECT_URI'),
  };

  const response = await got.post('connect/token', {
    prefixUrl: `https://auth.${env.get('TRUELAYER_DOMAIN')}.com`,
    form: authOptions,
  });

  const authData = JSON.parse(response.body);

  return authData.access_token;
}

export async function getAccounts(token) {
  const accResponse = await got('data/v1/accounts', {
    prefixUrl: `https://api.${env.get('TRUELAYER_DOMAIN')}.com`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return JSON.parse(accResponse.body).results;
}

export async function getCards(token) {
  const userResponse = await got('data/v1/cards', {
    prefixUrl: `https://api.${env.get('TRUELAYER_DOMAIN')}.com`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return JSON.parse(userResponse.body).results;
}

export async function getAccountTransactions(token, account) {
  const transactionsResponse = await got(`data/v1/accounts/${account.account_id}/transactions`, {
    prefixUrl: `https://api.${env.get('TRUELAYER_DOMAIN')}.com`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return JSON.parse(transactionsResponse.body).results;
}
