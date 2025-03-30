
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


const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
