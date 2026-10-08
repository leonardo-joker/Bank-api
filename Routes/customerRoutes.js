const express = require('express');
const router = express.Router();
const customer = require('../Controllers/customerController.js');

router.post('/onboardcustomer', customer.onboardCustomer);
router.get('/allcustomers', customer.getAllCustomers);

module.exports = router;
