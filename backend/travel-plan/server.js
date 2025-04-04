require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
// const TravelPlan = require("../models/Travel");
const cors = require('cors')
const { MongoClient, ObjectId } = require("mongodb");


// // Connect to MongoDB
// mongoose
//   .connect(process.env.TRAVEL_PLAN_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

const app = express();
app.use(express.json());
app.use(cors());

app.get('/travel-plans/:id', async (req, res) => {
    console.log("Route hit!");
    const client = new MongoClient(process.env.TRAVEL_PLAN_URI);
    await client.connect();
    try {
      const id = req.params.id;
      const travel_plan = await client
        .db('travelDB')
        .collection('travelPlans')
        .findOne({ _id: new ObjectId(id) });
      await client.close();
      if (!travel_plan) {
        console.log("No travel plan found");
        return res.status(404).send({ message: "Travel plan not found" });
      }
      console.log("Travel plan found:", travel_plan);
      res.status(200).send(travel_plan);
    } catch (error) {
      console.error("Error fetching travel plan:", error);
      res.status(500).send({ message: "Internal server error", error: error.message });
    }
  });


app.get('/travel-plans', async(req, res) => {
    const client = new MongoClient(process.env.TRAVEL_PLAN_URI);
    await client.connect();
    const travel_plans = await client.db('travelDB').collection('travelPlans').find({}).toArray();
    await client.close();
    res.status(200).send(travel_plans);
})

app.post('/travel-plans', async (req, res) => {
  const client = new MongoClient(process.env.TRAVEL_PLAN_URI);
  await client.connect();
  try {
    const newTravelPlan = {
      ...req.body,
      createdAt: new Date()
    };
    
    const result = await client
      .db('travelDB')
      .collection('travelPlans')
      .insertOne(newTravelPlan);
    
    await client.close();
    
    // Return the created travel plan with its new ID
    res.status(201).send({
      ...newTravelPlan,
      _id: result.insertedId
    });
  } catch (error) {
    console.error("Error creating travel plan:", error);
    res.status(500).send({ message: "Internal server error", error: error.message });
  }
});

app.put('/travel-plans/:id', async (req, res) => {
  const client = new MongoClient(process.env.TRAVEL_PLAN_URI);
  await client.connect();
  try {
    const id = req.params.id;
    const updates = req.body;
    
    // Remove _id from updates if it exists
    delete updates._id;
    
    const result = await client
      .db('travelDB')
      .collection('travelPlans')
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: updates }
      );
    
    await client.close();
    
    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "Travel plan not found" });
    }
    
    // Fetch the updated document to return
    await client.connect();
    const updatedPlan = await client
      .db('travelDB')
      .collection('travelPlans')
      .findOne({ _id: new ObjectId(id) });
    await client.close();
    
    res.status(200).send(updatedPlan);
  } catch (error) {
    console.error("Error updating travel plan:", error);
    res.status(500).send({ message: "Internal server error", error: error.message });
  }
});

app.patch('/travel-plans/:id/paragraph', async (req, res) => {
  const client = new MongoClient(process.env.TRAVEL_PLAN_URI);
  await client.connect();
  try {
    const id = req.params.id;
    const { imgUrl, text } = req.body;
    
    // Create the update object using MongoDB dot notation
    const updateObj = {};
    updateObj[`paragraphs.${imgUrl}`] = text;
    
    const result = await client
      .db('travelDB')
      .collection('travelPlans')
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: updateObj }
      );
    
    await client.close();
    
    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "Travel plan not found" });
    }
    
    // Fetch the updated document to return
    await client.connect();
    const updatedPlan = await client
      .db('travelDB')
      .collection('travelPlans')
      .findOne({ _id: new ObjectId(id) });
    await client.close();
    
    res.status(200).send(updatedPlan);
  } catch (error) {
    console.error("Error updating paragraph:", error);
    res.status(500).send({ message: "Internal server error", error: error.message });
  }
});

app.delete('/travel-plans/:id', async (req, res) => {
  const client = new MongoClient(process.env.TRAVEL_PLAN_URI);
  await client.connect();
  try {
    const id = req.params.id;
    const result = await client
      .db('travelDB')
      .collection('travelPlans')
      .deleteOne({ _id: new ObjectId(id) });
    
    await client.close();
    
    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Travel plan not found" });
    }
    
    res.status(200).send({ message: "Travel plan deleted successfully" });
  } catch (error) {
    console.error("Error deleting travel plan:", error);
    res.status(500).send({ message: "Internal server error", error: error.message });
  }
});


app.get('/travel-plans/user/:userId', async (req, res) => {
  const client = new MongoClient(process.env.TRAVEL_PLAN_URI);
  await client.connect();
  try {
    const userId = parseInt(req.params.userId);
    const travel_plans = await client
      .db('travelDB')
      .collection('travelPlans')
      .find({ user_id: userId })
      .toArray();
    
    await client.close();
    
    res.status(200).send(travel_plans);
  } catch (error) {
    console.error("Error fetching user travel plans:", error);
    res.status(500).send({ message: "Internal server error", error: error.message });
  }
});

const PORT = process.env.PORT || 5050;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app; 