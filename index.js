const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;
require('dotenv').config();


const app = express();

//middleware
app.use(cors());
app.use(express.json());


// theGalleryDb
// jF7z13zdpZoXbngi


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ncc8jsr.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    await client.connect();
    console.log('Connection established')
  } catch (error) {
    console.log(error);
  }
}

run().catch(err => console.log(err))









app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server listening on port ,${port}`);
});


