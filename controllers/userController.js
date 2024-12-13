const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const {User} = require('../models/user'); // MongoDB model for User (both freelancers and companies)
const {Freelancer} = require('../models/freelancer-model'); // MongoDB model for Freelancers
const SECRET_KEY = "supersecretkey"; // Use environment variables in production (e.g., process.env.SECRET_KEY)

exports.signup = async (req, res) => {
    const { role, ...data } = req.body;
    console.log("Received data:", req.body);
    console.log("role received:", role);

    if (!role || (role !== "freelancer" && role !== "company")) {
        return res.status(401).send("Invalid role specified!");
    }

    if (!data.firstName || !data.lastName || !data.email || !data.password) {
        return res.status(400).send("All common fields are mandatory!");
    }

    if (!validator.isEmail(data.email)) {
        return res.status(400).send("Invalid email format");
    }

    if (role === " freelancer") {
        if (!data.workEx || !Array.isArray(data.expertise) || data.expertise.length === 0 || !data.availability || !data.rates || data.projectsCompleted === undefined || data.projectsCompleted === null) {
            return res.status(400).send("All freelancers fields are mandatory!");
        }

        if (typeof data.rates !== 'number') {
            return res.status(400).send("Rates should be in numbers");
        }
    } else if (role === " company") {
        if (!data.companyName || !data.desc || !data.companyWebsite) {
            return res.status(400).send("Company-specific fields (companyName, Description, companyWebsite) are required!");
        }
    }

    // Check if email already exists
    let existingUser;
    if (role === " freelancer") {
        existingUser = await Freelancer.findOne({ email: data.email });
    } else {
        existingUser = await User.findOne({ email: data.email });
    }

    if (existingUser) {
        return res.status(400).send("Email already exists!");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    let newUser;
    if (role === "freelancer") {
        newUser = new Freelancer({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: hashedPassword,
            expertise: data.expertise,
            workEx: data.workEx,
            rates: data.rates,
            reviews: 0,
            projectsCompleted: data.projectsCompleted
        });
    } else if (role === "company") {
        newUser = new User({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: hashedPassword,
            companyName: data.companyName,
            desc: data.desc,
            companyWebsite: data.companyWebsite
        });
    }

    // Save the new user to MongoDB
    try {
        await newUser.save();
        return res.status(201).json({
            message: role === "freelancer" ? "New freelancer added" : "Company Registered!",
            user: newUser
        });
    } catch (error) {
        console.error("Error saving user:", error);
        return res.status(500).send("Internal Server Error");
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);

    if (!email || !password) {
        return res.status(400).send("All fields are mandatory");
    }

    let user;

    // Look for user in the Freelancer collection
    user = await Freelancer.findOne({ email });

    // If not found, look for user in the Company collection
    if (!user) {
        user = await User.findOne({ email });
    }

    if (!user) {
        return res.status(404).send("User does not exist");
    }

    // Compare the provided password with the stored hashed password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return res.status(400).send("Invalid credentials");
    }

    // Generate JWT token with role included in payload
    const token = jwt.sign(
        {
            id: user._id, // Use the _id field in MongoDB
            role: user.role, // Include role in the token payload
        },
        SECRET_KEY,
        { expiresIn: "1h" }
    );

    // Set cookie with the token
    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 3600000, // 1 hour
    });

    return res.status(200).json({
        message: "Login successful",
        user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        },
    });
};
