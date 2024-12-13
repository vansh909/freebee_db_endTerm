const Work = require('../models/work'); // MongoDB model for Work

// Create a new work post
exports.createWork = async (req, res) => {
    const { title, description, requirements, duration, budget, isNegotiable } = req.body;
    const user = req.user;

    console.log(user);
    if (user.role === " freelancer") {
        return res.status(400).send("Freelancer cannot post a work!");
    }

    if (!title || !description || !Array.isArray(requirements) || requirements.length === 0 || !duration || !budget || typeof isNegotiable !== 'boolean') {
        console.log(isNegotiable);
        return res.status(400).json({ message: 'Invalid input data' });
    }

    // Create the new work object
    const newWork = new Work({
        title,
        description,
        requirements,
        duration,
        budget,
        workBy: user.companyName,
        isNegotiable,
        isAccepted: false,
    });

    try {
        // Save the new work to MongoDB
        await newWork.save();
        return res.json({
            message: 'Work created successfully',
            work: newWork,
        });
    } catch (error) {
        console.error("Error creating work:", error);
        return res.status(500).send("Internal Server Error");
    }
};

// Delete a work post by its ID
exports.deleteWork = async (req, res) => {
    const id = req.params.id;

    try {
        // Find the work post by ID and delete it
        const work = await Work.findByIdAndDelete(id);

        if (!work) {
            return res.status(400).send("No work found!");
        }

        return res.status(200).json({ message: "Work deleted successfully" });
    } catch (error) {
        console.error("Error deleting work:", error);
        return res.status(500).send("Internal Server Error");
    }
};
