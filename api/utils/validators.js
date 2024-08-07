const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validatePassword = (password) => {
  if (typeof password !== 'string') return false;
  return password.length > 4;
};

const isPhoneValid = (phone) => {
  const phoneRegex = /^69\d{8}$/;
  return phoneRegex.test(phone);
}

module.exports = {
  validateEmail,
  isPhoneValid,
  validatePassword,
};
