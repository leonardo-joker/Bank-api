const express = require('express');
const router = express.Router();
const user = require('../Controllers/userController.js');
const validate = require('../Middlewares/validate.js');
const auth = require('../Middlewares/auth.js');

router.post('/createuser', validate.user, user.createUser);
router.post('/login', auth.apiAuth, validate.login, user.loginUser);
router.get('/user/:id', user.getUser);
router.get('/allusers', user.getAllUsers);
router.patch('/user/:id', validate.update, user.updateUser);
router.delete('/user/:id', user.deleteUser);

module.exports = router;
