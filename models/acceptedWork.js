const mongoose = require('mongoose');

// Define schema for AcceptedWork
const acceptedWorkSchema = new mongoose.Schema({
  workId: { type: Number, required: true },
  workName: { type: String, required: true },
  companyName: { type: String, required: true },
  counterOffer: { type: Number, default: null },
  freelancerName: { type: String, required: true },
  accepted: { type: String, required: true }, // "yes" or counter value
  isAccepted: { type: Boolean, default: false },
});

// Create the model
const AcceptedWork = mongoose.model('AcceptedWork', acceptedWorkSchema);

// CRUD operations
// const readAcceptedWorks = async () => {
//   return await AcceptedWork.find();
// };

// const writeAcceptedWorks = async (data) => {
//   const newAcceptedWork = new AcceptedWork(data);
//   return await newAcceptedWork.save();
// };

module.exports = {
  AcceptedWork,
  // readAcceptedWorks,
  // writeAcceptedWorks,
};
