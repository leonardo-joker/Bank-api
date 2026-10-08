const User = require('../Models/user.js');
const api = require('../Services/nibssApi.js');
const Customer = require('../Models/CustomerAccount.js');

const onboardCustomer = async (req, res) => {
  try {
    const { email, kycType } = req.body;

    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer already exists.' });
    }

    const theUser = await User.findOne({ email });

    // Check if the user already exists based on email
    if (!theUser) {
      return res.status(400).json({ message: `User doesn't already exists.` });
    }
    const { firstName, lastName, bvn, nin, dob, phone, image } = theUser;
    let kycResult;
    let isKycVerified;
    let kycID;

    if (kycType === 'bvn') {
      kycResult = await api.validateBvn(bvn);
    }

    if (kycType === 'nin') {
      kycResult = await api.validateNin(nin);
    }

    if (kycResult.status !== 200) {
      return res
        .status(404)
        .json({ message: `Couldn't validate the ${kycType}` });
    } else {
      isKycVerified = true;
      kycID = theUser[kycType];
    }

    const fullName = `${firstName} ${lastName}`;
    const newCustomer = new Customer({
      userID: theUser._id,
      accountName: fullName,
      email,
      dob,
      phone,
      image: image || 'not available yet',
      kycType,
      kycID,
      isKycVerified,
    });
    await newCustomer.save();

    res
      .status(201)
      .json({ message: `Account created successfully`, newCustomer });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.status(200).json({ message: `Customers found`, customers });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  onboardCustomer,
  getAllCustomers,
};
