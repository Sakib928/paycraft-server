const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
require('dotenv').config();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(cors());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1towayy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
        const userCollection = client.db('paycraftDB').collection('users');
        app.post('/users', async (req, res) => {
            const user = req.body;
            user.pin = await bcrypt.hash(user.pin, 10);
            const filter = { $or: [{ email: user.email_or_phone }, { phone: user.email_or_phone }] };
            const check = await userCollection.find(filter);
            if (check) {
                return res.send({ status: 'duplicate id' })
            }
            const result = await userCollection.insertOne(user);
            res.send(result);
        })
        app.post('/login', async (req, res) => {
            const userCredentials = req.body;
            const filter = { $or: [{ phone: userCredentials.email_or_phone }, { email: userCredentials.email_or_phone }] };
            const userExist = await userCollection.findOne(filter);
            if (userExist) {
                const token = jwt.sign(userExist, process.env.ACCESS_TOKEN, { expiresIn: '6h' })
                if (userExist.status === 'verified') {
                    return res.send({ token, userData: userExist, status: 'success' });
                } else {
                    return res.send({ userData: {}, status: 'failed' })
                }
            } else {
                return res.send({ userData: {}, status: 'failed' })
            }
        })










        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('server is up and running')
})


app.listen(port, async () => {
    console.log(`server is running on port ${port}`)
})

