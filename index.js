const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
// Use CORS middleware
app.use(cors());

// Database Connection

const uri =
  "mongodb+srv://hanifcse90:u4OPMIeP8dMojD4y@jobtask.n52vn14.mongodb.net/?retryWrites=true&w=majority&appName=jobTask";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const userDB = client.db("userDB");
    const userInfoCollection = userDB.collection("userInfoCollection");

    const taskDb = client.db("taskDb");
    const taskInformationCollection = taskDb.collection(
      "taskInformationCollection"
    );

    app.post("/users", async (req, res) => {
      const data = req.body;
      const isExist = await userInfoCollection.findOne({ email: data.email });
      if (isExist) {
        return;
      }
      const result = await userInfoCollection.insertOne(data);
      res.status(201).json(result);
    });

    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const data = req.body;
      const result = await userInfoCollection.findOne({ email: email });
      res.status(201).json(result);
    });

    app.get("/users", async (req, res) => {
      const result = await userInfoCollection.find().toArray();
      res.status(201).json(result);
    });

    app.patch("/users/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email };
      const data = req.body;
      const result = await userInfoCollection.updateOne(filter, {
        $set: data,
      });

      res.status(201).json(result);
    });
    // Task Relatade Information

    // Create a task
    app.post("/task", async (req, res) => {
      const doc = req.body;
      const result = await taskInformationCollection.insertOne(doc);
      res.status(201).json(result);
    });

    // Get Pending Task Data
    app.get("/task", async (req, res) => {
      const taskData = taskInformationCollection.find({ status: "tod-do" });
      const result = await taskData.toArray();
      res.status(201).json(result);
    });
    // Get All Task Data
    app.get("/task/all", async (req, res) => {
      const taskData = taskInformationCollection.find();
      const result = await taskData.toArray();
      res.status(201).json(result);
    });

    // get Ongoing Task
    app.get("/task/ongoing", async (req, res) => {
      const ongoingTasks = await taskInformationCollection
        .find({ status: "ongoing" })
        .toArray();

      res.status(201).json(ongoingTasks);
    });
    // get Ongoing Task
    app.get("/task/complete", async (req, res) => {
      const ongoingTasks = await taskInformationCollection
        .find({ status: "complete" })
        .toArray();

      res.status(201).json(ongoingTasks);
    });
    // get Single Data
    app.get("/task/edit-task/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await taskInformationCollection.findOne(filter);
      res.status(201).json(result);
    });

    app.patch("/task/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      console.log("Data: ", data, "id", id);
      const filter = { _id: new ObjectId(id) };

      const result = await taskInformationCollection.updateOne(filter, {
        $set: data,
      });

      res.status(201).json(result);
    });

    app.patch("/task/status/:id", async (req, res) => {
      const { id } = req.params;
      const { status } = req.body;
      const quary = { _id: new ObjectId(id) };

      try {
        const updatedTask = await taskInformationCollection.updateOne(
          quary,
          { $set: { status } },
          { new: true }
        );

        res.json(updatedTask);
        console.log(updatedTask);
      } catch (error) {
        res.status(500).json({ error: "Failed to update task status" });
      }
    });

    // Delete Data

    app.delete("/task/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await taskInformationCollection.deleteOne(filter);
      res.status(201).json(result);
    });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

// Define a simple route
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// user Name: hanifcse90
// Password: u4OPMIeP8dMojD4y
