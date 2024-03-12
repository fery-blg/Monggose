const express = require("express");

const app = express();
app.use(express.json());

const dotenv = require("dotenv");

dotenv.config();

console.log(process.env.DATA_BASE_URL);

/// connect mongodb to express app
const mongoose = require("mongoose");
mongoose
  .connect(process.env.DATA_BASE_URL)
  .then((res) => console.log("database connected"))
  .catch((err) => console.log(err));

// define Person Model

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  age: Number,
  favoriteFoods: [String],
});
const Person = mongoose.model("Person", personSchema);

// create Person Route

app.post("/create_person", async (req, res) => {
  try {
    console.log(req.body);
    const newPerson = new Person(req.body);
    await newPerson.save();
    res.status(200).json({ message: "success", data: newPerson });
  } catch (error) {
    res.status(500).json({ message: "error" });
  }
});

// Create Many Persons

app.post("/create_many", async (req, res) => {
  try {
    console.log(req.body);
    const persons = await Person.create(req.body);

    res.status(200).json({ message: "success", data: persons });
  } catch (error) {
    res.status(500).json({ message: "error" });
  }
});

// find a person by name

app.get("/find_by_name/:name", async (req, res) => {
  try {
    console.log(req.params);
    const found = await Person.find({ name: req.params.name });
    // const person = await Person.findOne({ favoriteFood: { $in: [food] } });

    res.status(200).json({ message: "success", data: found });
  } catch (error) {
    res.status(500).json({ message: "error" });
  }
});

// find by food
app.get("/find_by_food", async (req, res) => {
  try {
    console.log(req.query);

    const person = await Person.findOne({
      favoriteFoods: { $in: [req.query.food] },
    });

    res.status(200).json({ message: "success", data: person });
  } catch (error) {
    res.status(500).json({ message: "error" });
  }
});



// find personby id 
app.get("/find_by_id", async (req, res) => {
    try {
      console.log(req.query);
  
      const person = await Person.findById(req.query.id)
    
  
      res.status(200).json({ message: "success", data: person });
    } catch (error) {
      res.status(500).json({ message: "error" });
    }
  });


  // find by id and update food (classic)

  app.post("/find_by_id_and_update", async (req, res) => {
    try {
      console.log(req.query);
  
      const person = await Person.findById(req.query.id)

      person.favoriteFoods.push(req.body.food)
      await person.save()
    
  
      res.status(200).json({ message: "success", data: person });
    } catch (error) {
      res.status(500).json({ message: "error" });
    }
  });

// modern update
  app.post("/find_by_name_and_update/:name", async (req, res) => {
    try {
      console.log(req.params);

    //   const updated = await Person.findOneAndUpdate({name:req.params.name} , {
    //      $push: { favoriteFoods: req.body.food }

    //   } ,{new:true})
        const updated = await Person.findOneAndUpdate({name:req.params.name} , {
         age: req.body.age

      } ,{new:true})
  
      res.status(200).json({ message: "success", data: updated });
    } catch (error) {
      res.status(500).json({ message: "error" });
    }
  });


  app.delete("/find_by_id_and_delete", async (req, res,)=> {
    try {
      console.log(req.query);

      const deleted = await Person.findByIdAndDelete(req.query.id)
  
      // const person = await Person.findById(req.query.id)
    
  
      res.status(200).json({ message: "success", data:deleted });
    } catch (error) {
      res.status(500).json({ message: "error" });
    }

  })

  app.delete("/delete_many/:name", async (req, res,)=> {
    try {
      console.log(req.params);

      

      const deleted = await Person.deleteMany({name:req.params.name})
  
      // const person = await Person.findById(req.query.id)
    
  
      res.status(200).json({ message: "success" ,data : deleted});
    } catch (error) {
      res.status(500).json({ message: "error" });
    }

  })


  // //Chain Search Query Helpers to Narrow Search Results
  // app.get("/q_10", async (req, res) => {
  //   //req.query.fav=any existing food in the database 
  //   try {
  //       console.log(req.query)
  //     const data = await  Person
  //       .find({ favoriteFoods: req.query.fav }) // Find people who like burritos (assuming it's a direct match)
  //       .sort('name') // Sort by name
  //       .limit(2) // Limit the results to 2 documents
  //       .select('-age') // Hide their age
  //       .exec();
  
  //     res.status(200).json({ message: "well done", data });
  //   } catch (err) {
  //     res.status(500).json({ error: err });
  //   }
  // });
  

app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
