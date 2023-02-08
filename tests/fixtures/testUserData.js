// create user
const newUser = {
  name: 'John Galt',
  email: 'JohnGalt@test.com',
  password: '111111',
};

const invalidNewUser = {
  name: 'John Galt',
  email: 'mail',
  password: '111111',
};

// update user info
const newUserInfo = {
  name: 'polna',
  email: 'JohnGalt@test.com',
};

const newUserInfoInvalidEmail = {
  name: 'polina',
  email: 'JohnGalt',
};

const newUserInfoInvalidName = {
  name: '',
  email: 'JohnGalt@test.com',
};

module.exports = {
  newUser,
  invalidNewUser,
  newUserInfo,
  newUserInfoInvalidEmail,
  newUserInfoInvalidName,
};
