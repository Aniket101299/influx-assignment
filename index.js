const express = require("express");
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

const connect = () => {
    return mongoose.connect(
        "mongodb+srv://Aniket:Aniket_1029@cluster0.jh1in.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
        );
};


const itemSchema = new mongoose.Schema(
    {
      code: { type: Number, required: true },
      name: { type: String, required: true },
      unitPrice: { type: Number, required: true },
    },
    {
      versionKey: false, 
      timestamps: true, 
    }
  );
  

  const ItemMaster = mongoose.model("itemMaster", itemSchema); 


  const cartSchema = new mongoose.Schema(
    {
        code: { type: Number, required: true },
        qty: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        totalAmount: { type: Number, required: true }
    },
    {
      versionKey: false, 
      timestamps: true, 
    }
  );
  
  const UserCart = mongoose.model("userCart", cartSchema); 


  
app.post("/items", async (req, res) => {
    try {
      const itemMaster = await ItemMaster.create(req.body);
  
      return res.status(201).send(itemMaster);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  });
  

  app.post("/order", async (req, res) => {
    try {
      const userCart = await UserCart.create(req.body);
  
      return res.send(userCart);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  });


  app.get("/summarize", async (req, res) => {

    try {

    let summarizeData = getUniquePrducts(UserCart);

    function checkAndUpdate(arr, product) {

        let respectiveIndex = arr.findIndex( (el) => (el.code == product.code) );
       
        if( respectiveIndex == -1 ) {
            arr.push(product);
        } else {
            arr[respectiveIndex].qty = arr[respectiveIndex].qty + product.qty;
        }
          return arr;
    }
    
    
    function getUniquePrducts(listOfProducts) {
    
        let OutputArr = new Array(0);
       
        for (let i = 0; i < listOfProducts.length; i++) {
    
            checkAndUpdate(OutputArr, listOfProducts[i]);
    
        } 
    
        return OutputArr;
    
    } 
    
      let userCart = await summarizeData.find().lean().exec();  

      return res.send(userCart);

    } catch (err) {

      return res.status(500).send(err.message);
    
    }

  });
 
  app.listen(process.env.PORT || 2345, async function () {
  try {
    await connect();
    console.log("listening on port 2345");
  } catch (e) {
    console.log(e.message);
  }
});