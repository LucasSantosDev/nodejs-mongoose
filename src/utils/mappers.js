const mapUserAuth = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  age: user?.age,
  createdAt: user?.createdAt,
  updatedAt: user?.updatedAt,
});

module.exports = {
  mapUserAuth,
};
