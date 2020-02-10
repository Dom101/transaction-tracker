import express from 'express';
import qs from 'qs';
import dotenv from 'dotenv';

import { getToken } from '../libs/truelayer';
import { createUserWithTransactions } from '../libs/utils';
import env from '../libs/env';

dotenv.config();

const router = express.Router();

/* GET inital route. */
router.get('/', (req, res) => {
  const uriOptions = qs.stringify({
    response_type: 'code',
    client_id: env.get('CLIENT_ID'),
    scope: 'info accounts balance cards transactions direct_debits offline_access',
    redirect_uri: env.get('REDIRECT_URI'),
    providers: 'uk-ob-all uk-oauth-all uk-cs-mock',
  });

  const url = `https://auth.${env.get('TRUELAYER_DOMAIN')}.com/?${uriOptions}`;
  res.redirect(url);
});

router.get('/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const token = await getToken(code);

    const user = await createUserWithTransactions(token);

    res.set('Content-Type', 'text/plain');

    return res.status(200).send(`
      Welcome ${user.name}! 
      We've added ${user.numberOfAccounts} account${user.numberOfAccounts > 1 ? 's' : ''}
      Here's your UserID: ${user.id}
    `);
  } catch (err) {
    return res.status(500).send(`
      Sorry there seems to have been a problem signing up
      Error: ${err.message}
    `);
  }
});

export default router;
