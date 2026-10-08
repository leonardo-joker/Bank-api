const express = require('express');
const router = express.Router();
const acct = require('../Controllers/accountController.js');
const auth = require('../Middlewares/auth.js');

router.post('/createaccount', auth.apiAuth, acct.createAccount);
router.post('/transfer', auth.auth, auth.apiAuth, acct.transferFund);
router.post('/accountbalance', auth.apiAuth, acct.accountBalance);

module.exports = router;
