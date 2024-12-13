const mongoose = require('mongoose');

// Define schema for Work
const workSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  workBy: { type: String, required: true }, // Company Name
  isNegotiable: { type: Boolean, default: false },
  isAccepted: { type: Boolean, default: false },
});

// Create the model
const Work = mongoose.model('Work', workSchema);

// // CRUD operations
// const readWork = async () => {
//   return await Work.find();
// };

// const writeWork = async (data) => {
//   const newWork = new Work(data);
//   return await newWork.save();
// };

module.exports = {
  Work,
  // readWork,
  // writeWork,
};
