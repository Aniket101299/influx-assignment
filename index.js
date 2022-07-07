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
      const item = await ItemMaster.create(req.body);
  
      return res.status(201).send(item);
    } catch (err) {
      return res.status(500).send(err.message);
    }
  });
  
//   app.get("/users", async (req, res) => {
//     // thennable => proper then
//     try {
//       const users = await User.find().lean().exec(); // db.users.find() // proper promise
  
//       return res.send(users);
//     } catch (err) {
//       return res.status(500).send(err.message);
//     }
//   });
  
//   // met + route => get /users/${variable} and the name of variable is id
//   app.get("/users/:id", async (req, res) => {
//     try {
//       const user = await User.findById(req.params.id).lean().exec();
  
//       if (user) {
//         return res.send(user);
//       } else {
//         return res.status(404).send({ message: "User not found" });
//       }
//     } catch (err) {
//       return res.status(500).send(err.message);
//     }
//   });
  