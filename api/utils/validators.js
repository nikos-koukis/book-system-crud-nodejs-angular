const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validatePassword = (password) => {
  if (typeof password !== 'string') return false;
  return password.length > 4;
};

module.exports = {
  validateEmail,
  validatePassword,
};
