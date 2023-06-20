const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//chocolateCrud
//g5NeMYfoq5XYoyPx

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.igfrycv.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();
    const chocolateCollection = client.db('allChocolate').collection('chocolate');

    //get-chocolate
    app.get('/chocolate', async(req, res)=>{
      const result = await chocolateCollection.find().toArray();
      res.send(result);
    })

    //single-id
    app.get('/chocolate/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const result = await chocolateCollection.findOne(filter);
      res.send(result);
    })

    //add-chocolate
    app.post('/chocolate', async(req, res)=>{
      const body = req.body;
      const result = await chocolateCollection.insertOne(body);
      res.send(result)
    })

    //update-one
    app.put('/chocolate/:id', async(req, res)=>{
      const id = req.params.id;
      const body = req.body;
      const filter = {_id: new ObjectId(id)};
      const option = {upsert: true};
      const updateDoc = {
        $set:{
          ...body
        }
      }
      const result = await chocolateCollection.updateOne(filter, updateDoc, option);
      res.send(result);
    })

    //delete-one
    app.delete('/chocolate/:id', async(req, res)=>{
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const result = await chocolateCollection.deleteOne(filter);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
  res.send("Server Hello")
})
app.listen(port, ()=>{
  console.log("hello Server");
})
