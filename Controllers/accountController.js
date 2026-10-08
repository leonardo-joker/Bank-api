const Customer = require('../Models/CustomerAccount.js');
const Transaction = require('../Models/Transaction.js');
const api = require('../Services/nibssApi.js');

const createAccount = async (req, res) => {
  try {
    const { email } = req.body;
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(404).json({ message: `Can't find this customer` });
    }
    if (customer.accountNumber) {
      return res
        .status(404)
        .json({ message: `This customer already has an account` });
    }
    const { kycType, isKycVerified, kycID, dob } = customer;
    if (!isKycVerified) {
      return res.status(400).json({ message: `This Customer is not verified` });
    }
    const accountCreation = await api.createAccount(
      kycType,
      kycID,
      dob,
      req.externalToken,
    );
    if (accountCreation.status !== 200) {
      return res.status(400).json({ message: `Account creation unsucessful` });
    }

    const account = accountCreation.data.account;
    if (customer.accountName !== account.accountName) {
      return res
        .status(400)
        .json({ message: `Account number is not for this user` });
    }
    customer.accountNumber = account.accountNumber;
    customer.balance = account.balance;
    customer.save();
    res
      .status(201)
      .json({ message: `Account created successfully`, customer, account });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const getAllRegisteredAccounts = async (req, res) => {
  try {
    const token = req.externalToken;
    const getAccounts = await api.getAllAccounts(token);
    if (getAccounts.status !== 200) {
      return res.status(400).json({ message: `Couldn't get the accounts` });
    }
    const accts = getAccounts.data;
    res.status(200).json({ message: 'Found all the accounts', accts });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const transferFund = async (req, res) => {
  try {
    const { accountNumber, amount } = req.body;
    const { email } = req.user;
    const token = req.externalToken;
    let recipient;
    let recipientName;
    const user = await Customer.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: `This user doesn't have an account` });
    }
    if (user.accountNumber === accountNumber) {
      return res
        .status(400)
        .json({ message: `You can't transfer to your own account` });
    }

    const verifyAcctNumber = await api.verifyAccountNumber(
      accountNumber,
      token,
    );
    if (verifyAcctNumber.status !== 200) {
      return res
        .status(400)
        .json({ message: `Account number could not be verified` });
    }
    if (user.balance < amount || user.balance - amount <= 200) {
      return res.status(400).json({ message: 'Insufficiate funds' });
    }
    recipientName = verifyAcctNumber.data.accountName;
    const isRecipientFromMyBank = await Customer.exists({ accountNumber });
    const from = user.accountNumber;
    const to = accountNumber;
    const transferRequest = await api.transferFunds(from, to, amount, token);
    if (transferRequest.status !== 200) {
      return res
        .status(400)
        .json({ message: `Couldn't transfer successfully` });
    }
    user.balance -= amount;
    await user.save();
    if (isRecipientFromMyBank) {
      recipient = await Customer.findOne({ accountNumber });
      recipient.balance += amount;
      await recipient.save();
    }

    const transactionDetails = transferRequest.data;
    const newTransaction = new Transaction({
      customerID: user._id,
      ...transactionDetails,
    });
    await newTransaction.save();
    res.status(200).json({
      message: `Successfully transferred ${amount} to ${recipientName}`,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const accountBalance = async (req, res) => {
  try {
    const { email } = req.body;
    const token = req.externalToken;
    let flag;
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(400).json({ message: `This user doesn't exists.` });
    }
    const accountNumber = customer.accountNumber;
    // console.log(accountNumber);
    const verifyAcctNumber = await api.verifyAccountNumber(
      accountNumber,
      token,
    );
    if (verifyAcctNumber.status !== 200) {
      return res
        .status(400)
        .json({ message: `Couldn't verify account number` });
    }

    const checkAcctBalance = await api.accountBalance(accountNumber, token);

    if (checkAcctBalance.status !== 200) {
      return res.status(400).json({ message: `Failed to get account balance` });
    }

    const accountDetails = checkAcctBalance.data;

    flag =
      customer.balance !== accountDetails.balance
        ? `There's an inconsitency with this customer's account balance\n Current System Balance = ${customer.balance}\n Current nibss Balance = ${accountDetails.balance}\nPlease, check for any pending or unrecorded transactions.`
        : `no flag`;

    res.status(200).json({ message: flag, accountDetails });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createAccount,
  getAllRegisteredAccounts,
  transferFund,
  accountBalance,
};
