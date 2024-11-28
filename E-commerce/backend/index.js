const port = 4000;
const express = require("express");
const { JsonWebTokenError } = require("jsonwebtoken");
const app = express();
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { type } = require("os");

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://malaikadev:malaika123@cluster0.c3gusfu.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0");

app.get("/",(req,res)=>{
  res.json({
    groupNumber: "Your Group Number",
    groupMembers: ["Malaika Tabassum", "Farah Shamshair", "Laiba Naeem"],
    projectTitle: "InStyle Cloth Store"
  });
})




//Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req, file, cb) =>{
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
})

const upload  = multer({storage: storage})

app.use('/images', express.static(path.join(__dirname, 'upload/images')));

app.post("/upload",upload.single('product'),(req, res) =>{

    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

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

app.post('/addproduct', async(req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0){
      let last_product_array = products.slice(-1);
      let last_product = last_product_array[0];
      id = last_product.id+1;
    }
    else{
      id = 1;
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,

    });
     console.log(product);
     await product.save();
     console.log("Saved");
     res.json({
        success:true,
        name:req.body.name, 
     })
})

//Creating API For deleting Products
app.post('/removeproduct' , async(req,res)=>{
  await Product.findOneAndDelete({id:req.body.id});
  console.log("Removed");
  res.json({
    success:true,
    name:req.body.name

  })
})

//Creating API for getting all products
app.get('/allproducts', async (req, res)=>{
  let products = await Product.find({});
  console.log("All Products Fetched");
  res.send(products);
})
// creating endpoint for newcollection data
app.get('/newcollections',async(req, res)=>{
  let products = await Product.find({});
  let newCollection = products.slice(1).slice(-8);
  console.log("NewCollection Fetched");
  res.send(newCollection);
})

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