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


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jeg7pmd.mongodb.net/?retryWrites=true&w=majority`;

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

        const usersCollection = client.db("Art_In_Motion").collection("users");
        const classesCollection = client.db("Art_In_Motion").collection("classes");
        const insttractorsCollection = client.db("Art_In_Motion").collection("instructors");
        const enrolled_coursesCollection = client.db("Art_In_Motion").collection("enrolled-courses");

        // user related apis
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const query = { userEmail: user.userEmail }
            const existingUser = await usersCollection.findOne(query);
            console.log('existing user', existingUser);
            if (existingUser) {
                return res.send({ message: 'user already exists' })
            }
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        app.get('/users', async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        })

        app.patch('/users/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const userRole = req.body;
            console.log(userRole);
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    role: `${userRole.role}`,
                },
            };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        //class related apis
        app.get('/classes', async (req, res) => {
            const result = await classesCollection.find().toArray();
            res.send(result)
        });

        //insturctors related apis
        app.get('/instructors', async (req, res) => {
            const result = await insttractorsCollection.find().toArray();
            res.send(result)
        });

        //enrollments related apis
        app.post('/enrolled-courses', async (req, res) => {
            const enrolledCourse = req.body;
            // console.log(enrolledCourse);
            const result = await enrolled_coursesCollection.insertOne(enrolledCourse)
            res.send(result);
        })

        app.get('/my-course', async (req, res) => {
            const email = req.query.email;
            if (!email) {
                res.send([]);
            }
            const query = { user_email: email }
            const result = await enrolled_coursesCollection.find(query).toArray();
            res.send(result);
        })

        app.delete('/my-course/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await enrolled_coursesCollection.deleteOne(query);
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


app.get('/', (req, res) => {
    res.send('art in motion is running');
})


app.listen(port, () => {
    console.log(`Art in motion is running on ${port}`);
})



