const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config()


const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


// username:genius-car-mechanics
// pass: lSOX2hk2BoKBMOB9


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kyyp9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('connected to mongodb')
        const database = client.db('carMechanic');
        const serviceCollection = database.collection('services')

        // GET API
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const service = await cursor.toArray();
            res.send(service);
        })

        // GET single servive
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        // POST API
        app.post('/services', async (req, res) => {
            // const service = {
            //     "name": "ENGINE DIAGNOSTIC",
            //     "price": "300",
            //     "description": "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa.",
            //     "img": "https://i.ibb.co/dGDkr4v/1.jpg"
            // }
            const service = req.body;
            console.log('hit the post api', service)
            const result = await serviceCollection.insertOne(service)
            res.json(service)
        })
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Running Genius car')
})

app.listen(port, () => {
    console.log('Listening port is', port);
})