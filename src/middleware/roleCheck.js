// middleware/roleCheck.js
const roleCheck = (roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' });
  }

  // For admins, check schoolId matches
  if (req.user.role === 'admin' && req.params.schoolId && req.user.schoolId !== req.params.schoolId) {
    return res.status(403).json({ message: 'Access denied: School mismatch' });
  }
  next();
};

module.exports = roleCheck;