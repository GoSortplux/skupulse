// middleware/accessControl.js
const config = require('../config/config');

const accessControl = (req, res, next) => {
  if (!config.accessEnabled) {
    return res.status(403).json({ message: 'Server access is currently disabled by the super admin' });
  }
  next();
};

module.exports = accessControl;