const mongoose = require('mongoose');

// Define schema for Freelancer
const Freelancer = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Add password field
  workEx: { type: Number, required: true }, // Years of work experience
  expertise: { type: [String], required: true }, // Array of expertise strings
  availability: { type: String, required: true }, // e.g., "full time"
  rates: { type: Number, required: true }, // Hourly rate
  projectsCompleted: { type: Number, required: true }, // Total projects completed
  skills: { type: [String], default: [] }, // Additional skills
  portfolio: { type: String, default: null }, // Optional portfolio link
});

module.exports = mongoose.model('Freelancer', Freelancer);


// CRUD operations
// const readFreelancers = async () => {
//   return await Freelancer.find();
// };

// const writeFreelancers = async (data) => {
//   const newFreelancer = new Freelancer(data);
//   return await newFreelancer.save();
// };

// module.exports = {
//   Freelancer,
//   // readFreelancers,
//   // writeFreelancers,
// };
