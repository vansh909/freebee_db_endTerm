const mongoose = require("mongoose");
const AcceptedWork = require("../models/acceptedWork"); // Mongoose model for accepted works
const Work = require("../models/work"); // Mongoose model for works
const chatQuestions = require("../Questions.json");

// Read works by the company
exports.readMyWork = async (req, res) => {
  try {
    const user = req.user;
    const works = await Work.find({ workBy: user.companyName });
    
    if (works.length === 0) {
      return res.status(404).send("No work by the company.");
    }
    res.send(works);
  } catch (error) {
    console.error("Error fetching works:", error.message);
    res.status(500).send("Server error while fetching works.");
  }
};

// Read counter offers for a specific work
exports.readMyCounterWorks = async (req, res) => {
  try {
    const workId = req.params.id;
    const user = req.user;

    const works = await AcceptedWork.find({
      workId: mongoose.Types.ObjectId(workId), // Ensure proper ObjectId usage
      companyName: user.companyName,
    });

    if (works.length === 0) {
      return res.status(404).send("No accepted works found for this job.");
    }

    res.status(200).send(works);
  } catch (error) {
    console.error("Error fetching counter works:", error.message);
    res.status(500).send("Server error while fetching counter works.");
  }
};

// Chatbot functionality
exports.chatBot = (req, res) => {
  const input = req.body.input;
  console.log("Received input:", input); // Log the received input

  if (!input || typeof input !== "string" || input.trim() === "") {
    console.log("Invalid input:", req.body); // Log invalid input
    return res.status(400).json({
      message: "Invalid input, please provide a valid message.",
    });
  }

  const processedInput = input.trim().toLowerCase();
  console.log("Processed input:", processedInput); // Log processed input

  const questions = chatQuestions;
  let matchedQuestions = [];

  for (let i = 0; i < questions.length; i++) {
    const storedQuestion = questions[i].question.trim().toLowerCase();
    if (storedQuestion.includes(processedInput)) {
      matchedQuestions.push({
        question: questions[i].question,
        reply: questions[i].answer,
      });
    }
  }

  if (matchedQuestions.length > 0) {
    return res.status(200).json({
      matches: matchedQuestions,
    });
  } else {
    return res.status(404).json({
      message:
        "No matching questions found for your input. Connecting to a Human Agent for your help.",
    });
  }
};
