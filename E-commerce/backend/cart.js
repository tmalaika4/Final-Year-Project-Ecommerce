const port = 8080;
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

// MongoDB connection for user data
mongoose.connect("mongodb+srv://tmalaika:malaika1234@user.bkswf.mongodb.net/?retryWrites=true&w=majority&appName=user");

const Users = mongoose.model('Users', {
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    cartData: { type: Object },
    date: { type: Date, default: Date.now }
});

// Middleware for token validation
const fetchUser = async (req, res, next) => {
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

app.get("/", (req, res) => {
  res.json({
    groupNumber: "Your Group Number",
    groupMembers: ["Malaika Tabassum", "Farah Shamshair", "Laiba Naeem"],
    projectTitle: "InStyle Cloth Store"
  });
});

// Add item to user cart
app.post('/addtocart', fetchUser, async (req, res) => {
    const user = await Users.findOne({ _id: req.user.id });
    user.cartData[req.body.itemId] += 1;
    await Users.findByIdAndUpdate(user.id, { cartData: user.cartData });
    res.json({ success: true, message:"Added" });
});

// Remove item from user cart
app.post('/removefromcart', fetchUser, async (req, res) => {
    const user = await Users.findOne({ _id: req.user.id });
    if (user.cartData[req.body.itemId] > 0) user.cartData[req.body.itemId] -= 1;
    await Users.findByIdAndUpdate(user.id, { cartData: user.cartData });
    res.json({ success: true, message:"Removed" });
});

// Get user cart data
app.post('/getcart', fetchUser, async (req, res) => {
    const user = await Users.findOne({ _id: req.user.id });
    if (user && user.cartData) {
        res.json(user.cartData);
    } else {
        res.status(404).json({ message: "User or cart data not found" });
    }
});

app.listen(port, (error) => {
    if (!error) console.log("Database Server 1 Running on Port " + port);
    else console.log("Error: " + error);
});
