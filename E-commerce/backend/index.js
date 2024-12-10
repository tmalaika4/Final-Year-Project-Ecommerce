const port = 4000;
const express = require("express");
const { JsonWebTokenError } = require("jsonwebtoken");
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');  // Correct way to import CloudinaryStorage
const path = require("path");
const cors = require("cors");
const { type } = require("os");

app.use(express.json());
app.use(cors());

const mongoURI = "mongodb+srv://malaikadev:malaika123@cluster0.c3gusfu.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0"

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get("/",(req,res)=>{
  res.json({
    groupMembers: ["Malaika Tabassum", "Farah Shamshair", "Laiba Naeem"],
    projectTitle: "InStyle Cloth Store"
  });
})

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'product-images', // Optional: Folder in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'], // Allowed image formats
  },
});

const upload = multer({ storage: storage });
// Cloudinary image upload endpoint
app.post('/upload', upload.single('product'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }
  res.json({
    success: true,
    image_url: req.file.path || req.file.secure_url, // Check for correct Cloudinary URL
  });
});



//Schema for Creating Products
const Product = mongoose.model("Product",{
      id:{
        type: Number,
        required: true,
      },
      name:{
        type:String,
        required:true,
      },
      image:{
        type: String,
        required: true,
      },
      category:{
        type:String,
        required: true,
      },
      new_price:{
        type:Number,
        required:true,
      },
      old_price:{
        type:Number,
        required:true,
      },
      date:{
        type:Date,
        default:Date.now,
      },
      available:{
          type:Boolean,
          default:true,
      },
})

app.post('/addproduct', async (req, res) => {
  try {
      console.log("Received Data:", req.body); // Log the incoming data

      let products = await Product.find({});
      let id;
      if (products.length > 0) {
          let last_product = products[products.length - 1];
          id = last_product.id + 1;
      } else {
          id = 1;
      }

      const { name, image, category, new_price, old_price } = req.body;

      // Validate the data
      if (!name || !image || !category || isNaN(new_price) || isNaN(old_price)) {
          return res.status(400).json({ success: false, message: "Invalid product data" });
      }

      const product = new Product({
          id: id,
          name: name,
          image: image,
          category: category,
          new_price: Number(new_price),
          old_price: Number(old_price),
      });

      console.log("Product to be saved:", product); // Log the product data before saving

      await product.save();
      console.log("Saved product to database");
      res.json({
          success: true,
          name: name,
      });
  } catch (error) {
      console.error("Error saving product:", error);
      res.status(500).json({ success: false, message: "Server error" });
  }
});

//Creating API For deleting Products


app.post('/removeproduct', async (req, res) => {
    try {
        const productId = req.body.id;

        // Fetch the product details to get the image URL
        const product = await Product.findOne({ id: productId });

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Extract the public ID (remove the file extension from the image URL)
        let publicId = product.image.split('/').slice(-2).join('/'); // Extracts the image path
        publicId = publicId.replace(/\.[^/.]+$/, ''); // Removes the file extension (.png, .jpg, etc.)

        console.log('Attempting to delete image with public ID:', publicId);

        // Delete the image from Cloudinary
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                console.error('Error deleting image from Cloudinary:', error);
                return res.status(500).json({ success: false, message: "Failed to delete image from Cloudinary" });
            }

            if (result.result === 'not found') {
                console.log('Image not found in Cloudinary, skipping deletion.');
            } else {
                console.log('Image deleted from Cloudinary:', result);
            }

            // Now, delete the product from the database
            Product.findOneAndDelete({ id: productId })
                .then(() => {
                    res.json({
                        success: true,
                        message: 'Product and image deleted successfully',
                    });
                })
                .catch((err) => {
                    console.error('Error deleting product from DB:', err);
                    res.status(500).json({ success: false, message: 'Failed to delete product from database' });
                });
        });
    } catch (error) {
        console.error('Error removing product:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});



//Creating API for getting all products
app.get('/allproducts', async (req, res)=>{
  let products = await Product.find({});
  console.log("All Products Fetched");
  res.send(products);
})
app.get('/newcollections', async (req, res) => {
  try {
    let products = await Product.find({});
    let newCollection = products.length > 8 ? products.slice(-8) : products;
    res.json(newCollection);
  } catch (err) {
    console.error("Error fetching new collections:", err);
    res.status(500).json({ success: false, message: "Error fetching new collections" });
  }
});


// creating endpoint for popular in women section
app.get('/popularinwomen', async(req, res)=>{
  let products = await Product.find({category:"women"});
  let popular_in_women = products.slice(0,4);
  console.log("Popular in women fetched");
  res.send(popular_in_women);
})




app.listen(port,(error)=>{
  if(!error){
      console.log("Server Running on Port " + port)
  }
  else{
      console.log("Error :"+error)
  }

})