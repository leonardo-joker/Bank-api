const jwt = require('jsonwebtoken');
const api = require('../Services/nibssApi.js');

exports.auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ message: 'Access denied. No token provided.' });
    }
    const token = authHeader.split(' ')[1];

    const decodedUser = jwt.verify(token, process.env.APISECRET);
    if (!decodedUser) {
      return res.status(401).json({ message: `couldn't verify token` });
    }
    req.user = decodedUser;
    console.log(req.user);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};
exports.apiAuth = async (req, res, next) => {
  try {
    const apiKey = process.env.APIKEY;
    const apiSecret = process.env.APISECRET;
    const response = await api.connectToNibss(apiKey, apiSecret);
    if (response.status !== 200) {
      res
        .status(401)
        .json({ message: 'Api Token was not generated successfully' });
    }
    // const extAuthHeader = req.headers.externalauthorization;
    const apiData = response.data;
    // const apiData = extAuthHeader;
    if (!apiData) {
      return res.status(401).json({ message: 'No api token provided.' });
    }
    // if (!apiData || !apiData.startsWith('Bearer ')) {
    //   return res.status(401).json({ message: 'No api token provided.' });
    // }
    // const apiToken = apiData.split(' ')[1];

    const apiToken = apiData.token;

    req.externalToken = apiToken;
    req.fintech = apiData.fintech;
    next();
  } catch (error) {
    res.status(401).json({ message: `Api error: ${error.message}` });
  }
};
