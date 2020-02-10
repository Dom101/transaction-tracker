import express from 'express';

import { db } from '../libs/database';

const router = express.Router();

/* GET user accounts. */
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await db.Users.findOne({
      where: {
        id: userId,
      },
    });

    res.set('Content-Type', 'application/json');
    return res.status(200).send(JSON.stringify(user));
  } catch (err) {
    res.set('Content-Type', 'text/plain');
    return res.status(500).send(`
      Sorry there seems to have been a problem
      Error: ${err.message}
    `);
  }
});

/* GET users accounts. */
router.get('/:userId/accounts', async (req, res) => {
  const { userId } = req.params;
  const accounts = await db.Accounts.findAll({
    where: {
      UserID: userId,
    },
  });

  res.set('Content-Type', 'application/json');
  return res.status(200).send(JSON.stringify(accounts));
});

/* GET all users transactions. */
router.get('/:userId/accounts/transactions', async (req, res) => {
  const { userId } = req.params;
  const transactions = await db.Transactions.findAll({
    include: [{
      model: db.Accounts,
      where: { UserId: userId },
      attributes: [],
    }],
    order: ['AccountId'],
  });

  res.set('Content-Type', 'application/json');
  return res.status(200).send(JSON.stringify(transactions));
});

/* GET a single accounts transactions. */
router.get('/:userId/accounts/:accountId/transactions', async (req, res) => {
  const { userId, accountId } = req.params;
  const transactions = await db.Transactions.findAll({
    where: { AccountId: accountId },
    include: [{
      model: db.Accounts,
      where: { UserId: userId },
      attributes: [],
    }],
  });

  res.set('Content-Type', 'application/json');
  return res.status(200).send(JSON.stringify(transactions));
});

export default router;
