const axios = require('axios');
const { apiErrors } = require('../Controllers/errorController.js');
const baseUrl = 'https://nibssbyphoenix.onrender.com/api';

const connectToNibss = async (apiKey, apiSecret, req) => {
  try {
    const response = await axios.post(
      `${baseUrl}/auth/token`,
      {
        apiKey: apiKey,
        apiSecret: apiSecret,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response;
  } catch (error) {
    console.error('Error connecting to NIBSS:', error.message);
    throw error;
  }
};

const RegisterBVN = async (bvn, firstName, lastName, dob, phone, req) => {
  try {
    const bvnRegistration = await axios.post(
      `${baseUrl}/insertBvn`,
      {
        bvn,
        firstName,
        lastName,
        dob,
        phone,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return bvnRegistration;
  } catch (error) {
    console.error('Error registering BVN:', error.message);
    throw error;
  }
};
const RegisterNIN = async (nin, firstName, lastName, dob, phone, req) => {
  try {
    const ninRegistration = await axios.post(
      `${baseUrl}/insertNin`,
      {
        nin,
        firstName,
        lastName,
        dob,
        phone,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return ninRegistration;
  } catch (error) {
    console.error('Error registering NIN:', error.message);
    throw error;
  }
};

const createAccount = async (kycType, kycID, dob, token) => {
  try {
    const accountResponse = await axios.post(
      `${baseUrl}/account/create`,
      {
        kycType,
        kycID,
        dob,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return accountResponse;
  } catch (error) {
    apiErrors(error);
    console.log('Error registering Account:', error.message);
  }
};

const verifyAccountNumber = async (accountNumber, token) => {
  try {
    const verify = await axios.get(
      `${baseUrl}/account/name-enquiry/${accountNumber}`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return verify;
  } catch (error) {
    apiErrors(error);
  }
};
const getAllAccounts = async (token) => {
  try {
    const getAccounts = await axios.get(`${baseUrl}/accounts`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return getAccounts;
  } catch (error) {
    apiErrors(error);
  }
};
const validateNin = async (nin) => {
  try {
    const validate = await axios.post(
      `${baseUrl}/validateNin`,
      {
        nin,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return validate;
  } catch (error) {
    apiErrors(error);
  }
};

const validateBvn = async (bvn) => {
  try {
    const validate = await axios.post(
      `${baseUrl}/validateBvn`,
      {
        bvn,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return validate;
  } catch (error) {
    apiErrors(error);
  }
};

const transferFunds = async (from, to, amount, token) => {
  try {
    const transfer = await axios.post(
      `${baseUrl}/transfer`,
      {
        from,
        to,
        amount,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return transfer;
  } catch (error) {
    apiErrors(error);
  }
};
const accountBalance = async (accountNumber, token) => {
  try {
    const balance = await axios.get(
      `${baseUrl}/account/balance/${accountNumber}`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return balance;
  } catch (error) {
    apiErrors(error);
  }
};
const verifyATransaction = async (ref, token) => {
  try {
    const transaction = await axios.get(`${baseUrl}/transaction/${ref}`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return transaction;
  } catch (error) {
    apiErrors(error);
  }
};

module.exports = {
  RegisterBVN,
  RegisterNIN,
  createAccount,
  connectToNibss,
  verifyAccountNumber,
  getAllAccounts,
  validateNin,
  validateBvn,
  transferFunds,
  accountBalance,
  verifyATransaction,
};
