const {Work }= require("../models/work"); // Mongoose model for works
const {AcceptedWork} = require("../models/acceptedWork"); // Mongoose model for accepted works

// Get all available works
exports.getAllWorks = async (req, res) => {
  try {
    const user = req.user;
    if (user.role === "company") {
      return res.status(400).send("Not authorized to see work!");
    }

    const works = await Work.find({ isAccepted: false });
    if (works.length === 0) {
      return res.status(404).send("No available works to display.");
    }

    res.status(200).json(works);
  } catch (error) {
    console.error("Error fetching works:", error.message);
    res.status(500).send("Server error while fetching works.");
  }
};

// Accept a work or send a counter offer
exports.acceptWork = async (req, res) => {
  try {
    const workId = req.params.id;
    const { accepted, counter } = req.body;
    const user = req.user;

    if (user.role === "company") {
      return res.status(403).send("Companies cannot accept work!");
    }

    const work = await Work.findById(workId);
    if (!work) {
      return res.status(404).send("Work not found.");
    }

    if (accepted === "counter" && work.isNegotiable) {
      if (counter == null || isNaN(counter) || counter <= 0 || counter < work.budget) {
        return res.status(400).send("Invalid counter offer.");
      }
    } else if (accepted !== "yes" || (accepted === "yes" && counter != null)) {
      return res.status(400).send("Invalid request parameters.");
    }

    const isAlreadyAccepted = await AcceptedWork.findOne({
      workId: work._id,
      freelancerName: `${user.firstName} ${user.lastName}`,
    });

    if (isAlreadyAccepted) {
      return res.status(400).send("You have already responded to this work.");
    }

    const newAcceptance = new AcceptedWork({
      workId: work._id,
      workName: work.title,
      companyName: work.workBy,
      counterOffer: accepted === "counter" ? counter : null,
      freelancerName: `${user.firstName} ${user.lastName}`,
      accepted: accepted === "yes" ? "yes" : counter,
    });

    if (newAcceptance.accepted === "yes") {
      work.isAccepted = true;
      await work.save();
    }

    await newAcceptance.save();

    const message =
      accepted === "counter"
        ? "Work sent for counter!"
        : "Work accepted successfully.";
    res.status(201).send(message);
  } catch (error) {
    console.error("Error processing work acceptance:", error.message);
    res.status(500).send("Server error while processing work acceptance.");
  }
};

// Get works based on freelancer's skills
exports.worksOnSkills = async (req, res) => {
  try {
    const user = req.user;
    if (user.role === "company") {
      return res.status(401).send("Access Denied for Company!");
    }

    const { skills } = req.query;
    if (!skills) {
      return res.status(400).send("Skills query parameter is required.");
    }

    const skillArray = skills.split(",").map((skill) => skill.trim().toLowerCase());
    if (skillArray.length === 0) {
      return res.status(400).send("Invalid Input: No skills provided.");
    }

    const works = await Work.find({
      isAccepted: false,
      requirements: { $exists: true, $not: { $size: 0 } },
    });

    const availableWorks = works.filter((work) =>
      work.requirements.some((reqSkill) =>
        skillArray.some((skill) => reqSkill.toLowerCase().includes(skill))
      )
    );

    if (availableWorks.length === 0) {
      return res.status(400).send("No work to display!");
    }

    res.status(200).json(availableWorks);
  } catch (error) {
    console.error("Error fetching works by skills:", error.message);
    res.status(500).send("Server error while fetching works by skills.");
  }
};
