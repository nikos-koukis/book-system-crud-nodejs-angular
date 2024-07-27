// Dashboard Controller for different user roles
const dashboard = (req, res) => {
  const userRole = req.user.role; // Get user role from req.user populated by authentication middleware

  if (userRole === 'user') {
    res.json({
      message: 'Welcome to your user dashboard!',
      user: req.user // Include user details if needed
    });
  } else if (userRole === 'admin') {
    res.json({
      message: 'Welcome to the admin dashboard!',
      user: req.user // Include user details if needed
    });
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
};

module.exports = { dashboard };