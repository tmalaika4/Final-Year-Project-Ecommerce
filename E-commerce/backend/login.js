const port = 5000;
const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb+srv://tmalaika:malaika1234@user.bkswf.mongodb.net/?retryWrites=true&w=majority&appName=user");

const Users = mongoose.model('Users', {
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    cartData: { type: Object },
    date: { type: Date, default: Date.now }
});

// Welcome endpoint
app.get("/", (req, res) => {
    res.json({
        groupMembers: ["Malaika Tabassum", "Farah Shamshair", "Laiba Naeem"],
        projectTitle: "InStyle Cloth Store"
    });
});

// Create new user (CREATE)
app.get('/signup', async (req, res) => {
    const { name, email, password } = req.query;  // Receiving data via query parameters

    // Validate input
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        // Check if the user already exists
        let existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Initialize cart
        let cart = {};
        for (let i = 0; i < 300; i++) cart[i] = 0;

        // Create new user and save
        const user = new Users({
            name,
            email,
            password,
            cartData: cart,
        });

        await user.save();
        

        const token = jwt.sign({ user: { id: user.id } }, 'secret_ecom');
        res.json({ success: true, token });
        
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating user", error });
    }
});


// Read user by email (READ)
app.get('/login', async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    try {
        const user = await Users.findOne({ email });
        if (user) {
            const token = jwt.sign({ user: { id: user.id } }, 'secret_ecom');
            res.json({ success: true, token });
        } else {
            res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error fetching user", error });
    }
});

// Read all users (READ all)
app.get('/all', async (req, res) => {
    try {
        const users = await Users.find({});
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching users", error });
    }
});

// Update user data by email (UPDATE)
app.get('/update', async (req, res) => {
    const { email, name, password } = req.query;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    try {
        const updateData = {};
        if (name) updateData.name = name;
        if (password) updateData.password = password;

        const user = await Users.findOneAndUpdate({ email }, updateData, { new: true });
        if (user) {
            res.json({ success: true, message: "User updated successfully", user });
        } else {
            res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating user", error });
    }
});

// Delete user by email (DELETE)
app.get('/delete', async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    try {
        const user = await Users.findOneAndDelete({ email });
        if (user) {
            res.json({ success: true, message: "User deleted successfully" });
        } else {
            res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting user", error });
    }
});

// Start server
app.listen(port, (error) => {
    if (!error) console.log("Server Running on Port " + port);
    else console.log("Error: " + error);
});
