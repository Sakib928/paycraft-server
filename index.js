const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('server is up and running')
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})

