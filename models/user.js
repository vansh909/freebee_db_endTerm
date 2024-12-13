const mongoose = require('mongoose');

// Define schema for User
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['freelancer', 'company'] },
  isPrivate: { type: Boolean, default: false },
});

// Create the model
const User = mongoose.model('User', userSchema);

// CRUD operations
// const readUsers = async () => {
//   return await User.find();
// };

// const writeUsers = async (data) => {
//   const newUser = new User(data);
//   return await newUser.save();
// };

module.exports = {
  User,
  // readUsers,
  // writeUsers,
};
