const express = require('express');
const req = require('express/lib/request');
require('dotenv').config()
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

//This are my middleware
app.use(cors());
app.use(express.json());

// userName: Art_in_Motion,
// password: tRxZoW8KNSJvtJKA


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://<username>:<password>@cluster0.jeg7pmd.mongodb.net/?retryWrites=true&w=majority";

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
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
// run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('art in motion is running');
})


app.listen(port, () => {
    console.log(`Art in motion is running on ${port}`);
})