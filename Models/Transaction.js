const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    customerID: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
    },
    reference: {
      type: String,
      required: true,
    },
    senderAccount: {
      type: String,
      required: true,
    },
    receiverAccount: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
