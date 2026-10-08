const User = require('../Models/user.js');
const Customer = require('../Models/CustomerAccount.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { generateNumber } = require('../Utility/helper.js');
const api = require('../Services/nibssApi.js');

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, dob, password, phone } = req.body;

    // Check if the user already exists based on email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // check if the phone number already exists
    const existingPhone = await User.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({ message: 'Phone number already exists.' });
    }

    //generate and register bvn
    let bvn = generateNumber();
    const existingBVN = await User.findOne({ bvn });
    while (existingBVN) {
      bvn = generateNumber();
      existingBVN = await User.findOne({ bvn });
    }
    const bvnRegistration = await api.RegisterBVN(
      bvn,
      firstName,
      lastName,
      dob,
      phone,
    );
    if (bvnRegistration.status !== 201) {
      return res.status(400).json({ message: 'BVN registration failed.' });
    }

    //generate and register nin
    let nin = generateNumber();
    const existingNIN = await User.findOne({ nin });
    while (existingNIN) {
      nin = generateNumber();
      existingNIN = await User.findOne({ nin });
    }
    const ninRegistration = await api.RegisterNIN(
      nin,
      firstName,
      lastName,
      dob,
      phone,
    );
    if (ninRegistration.status !== 200) {
      return res.status(400).json({ message: 'NIN registration failed.' });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user with the hashed password
    const newUser = new User({
      ...req.body,
      bvn,
      nin,
      password: hashedPassword,
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    //check if all required fields are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Please provide email and password.' });
    }
    // check if the user exists based on email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    //check if password provided is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.APISECRET,
      { expiresIn: process.env.EXPIRES },
    );
    const apiToken = req.externalToken;
    res.status(200).json({ message: 'Login successful.', token, apiToken });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedData = req.body;
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const customer = await Customer.findOne({ email: user.email });
    await customer.deleteOne();
    await user.deleteOne();
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createUser,
  loginUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
