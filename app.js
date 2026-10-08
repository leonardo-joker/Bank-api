const express = require('express');
const app = express();
const dotenv = require('dotenv');

dotenv.config();
const connectDB = require('./Config/databaseConfig.js');
const userRoutes = require('./Routes/userRoutes.js');
const acctRoutes = require('./Routes/accountRoutes.js');
const customerRoutes = require('./Routes/customerRoutes.js');
const transactionRoutes = require('./Routes/transactionRoutes.js');

const port = process.env.PORT || 3000;

connectDB();
// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/users', userRoutes);
app.use('/api/accounts', acctRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/transactions', transactionRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
