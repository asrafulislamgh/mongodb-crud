const express = require("express");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const app = express();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const { json } = require("express");

// Milldeware
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

// Connecting Mongodb
// user: caruser
// pass: HOv5L11vG343W0ZK
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.is4ba.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("carMechanic");
    const servicesCollection = database.collection("services");

    // GET API
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // Get a single item
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      console.log(query, service);
      res.json(service);
    });

    // POST API
    app.post("/services", async (req, res) => {
      const service = req.body;
      //   console.log("hitting the post", service);
      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.json(result);
    });

    // DELETE API
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
      console.log("The result is: ", result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  console.log("Bismillahir Rahmanir");
  res.send("Bismillah, Alhamdulillah");
});

app.listen(port, () => {
  console.log("The website is running on port: ", port);
});
