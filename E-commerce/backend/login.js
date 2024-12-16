const port = 5000;
const express = require("express");
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());
app.use(cors());

const uri = "mongodb+srv://tmalaika:malaika1234@user.bkswf.mongodb.net/?retryWrites=true&w=majority&appName=user";

mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch((err) => console.error('Failed to connect to MongoDB:', err));

// MongoDB connection
//mongoose.connect(uri);


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
        

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                name: user.name
              
            },
            'secret_ecom'
          );
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
            const token = jwt.sign(
                {
                 
                    id: user.id,
                    email: user.email,
                  
                },
                'secret_ecom'
            );
            res.json({ success: true, token });
        } else {
            res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Error fetching user", error });
    }
});

// Middleware to authenticate token
const authenticateToken =async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).json({ errors: "Please authenticate using valid token" });

    try {
        const data = jwt.verify(token, 'secret_ecom');
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).json({ errors: "Invalid token" });
    }
};


// Read all users (READ all)
app.get('/all',authenticateToken, async (req, res) => {
    try {
        const users = await Users.find({});
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching users", error });
    }
});

// Update user data by email (UPDATE)
app.get('/update',authenticateToken, async (req, res) => {
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
app.get('/delete',authenticateToken, async (req, res) => {
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
