const mongoose = require('mongoose');
const customerSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
    },
    balance: {
      type: Number,
    },
    kycType: {
      type: String,
      required: true,
      enum: ['bvn', 'nin'],
    },
    kycID: {
      type: String,
      required: true,
    },
    isKycVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Customer = mongoose.model('Customer', customerSchema);
module.exports = Customer;
