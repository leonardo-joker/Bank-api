const express = require('express');
const router = express.Router();
const transaction = require('../Controllers/transactionController');
const auth = require('../Middlewares/auth.js');

router.post(
  '/usertransactions',
  auth.apiAuth,
  transaction.getTransactionsForAUser,
);

module.exports = router;
