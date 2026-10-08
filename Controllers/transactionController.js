const Transaction = require('../Models/Transaction.js');
const Customer = require('../Models/CustomerAccount.js');

const getTransactionsForAUser = async (req, res) => {
  const { email } = req.body;
  const customer = await Customer.findOne({ email });
  if (!customer) {
    return res.status(400).json({ message: `Couldn't find customer` });
  }
  const transactions = await Transaction.find({ customerID: customer._id });
  if (!transactions) {
    return res.statu(400).json({
      message: `Couldn't find any transaction for this user.`,
    });
  }
  const noOfTransactions = transactions.length;
  res.status(200).json({
    message: `This user has made ${noOfTransactions} transactions.`,
    transactions,
  });
};
const getAllTransactions = async (req, res) => {
  const totalTransactions = await Transaction.find();
  if (!totalTransactions) {
    return res.status(400).json({ message: `Couldn't find the transactions.` });
  }
  if (totalTransactions.length === 0) {
    return res.status(400).json({ message: `` });
  }
};

module.exports = {
  getTransactionsForAUser,
};
