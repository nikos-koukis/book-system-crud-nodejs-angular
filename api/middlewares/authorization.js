const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if the user role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next(); // Proceed to the next middleware or route
  };
};

module.exports = { authorize };