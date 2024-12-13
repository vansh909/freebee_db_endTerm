const jwt = require('jsonwebtoken');
const SECRET_KEY = "supersecretkey";
const {User} = require('../models/user'); // MongoDB model for User
const {Freelancer} = require('../models/freelancer-model'); // MongoDB model for Freelancer

exports.authMiddleware = async (req, res, next) => {
    // Retrieve the token from cookies
    const token = req.cookies['token'];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, SECRET_KEY);
        if (!decoded) {
            return res.status(400).json({ message: "Invalid token" });
        }

        // Retrieve the user or freelancer from MongoDB using the decoded ID and role
        const user = await User.findOne({ _id: decoded.id, role: decoded.role });
        const freelancer = await Freelancer.findOne({ _id: decoded.id, role: decoded.role });

        if (!user && !freelancer) {
            return res.status(401).json({ message: "Unauthorized: User or freelancer not found" });
        }

        // Attach the correct entity to req.user
        req.user = user || freelancer;
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
