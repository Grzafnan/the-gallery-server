const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;
require('dotenv').config();


const app = express();

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ncc8jsr.mongodb.net/?retryWrites=true&w=majority`;

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

const Service = client.db('thegalleryDb').collection('services');
const Reviews = client.db('thegalleryDb').collection('reviews');

// home page services
app.get('/home-services', async (req, res) => {
  try {
    const services = await Service.find({}).sort({ $natural: -1 }).limit(3).toArray();
    res.send({
      success: true,
      data: services
    })

  } catch (error) {
    console.log(error);
    res.send({
      status: 'error',
      message: error.message,
    })
  }
})


//Services
app.get('/services', async (req, res) => {
  try {
    const services = await Service.find({}).sort({ $natural: -1 }).toArray();
    res.send({
      success: true,
      data: services
    })

  } catch (error) {
    console.log(error);
    res.send({
      status: 'error',
      message: error.message,
    })
  }
})

//Single Service
app.get('/service/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const services = await Service.findOne({ _id: ObjectId(id) });
    res.send({
      success: true,
      data: services
    })

  } catch (error) {
    console.log(error);
    res.send({
      status: 'error',
      message: error.message,
    })
  }
})


// Reviews Api
app.post('/review', async (req, res) => {
  try {
    const result = await Reviews.insertOne(req.body);
    // console.log(result);
    res.send(result);

  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

// Get Reviews
app.get('/review/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await Reviews.find({ serviceId: id }).sort({ $natural: -1 }).toArray();
    res.send({
      success: true,
      data: reviews
    });

  } catch (error) {
    console.log(error);
    res.send({
      status: 'error',
      message: error.message,
    })
  }
})

app.get('/my-reviews', async (req, res) => {
  try {
    const result = await Reviews.find({ email: req.query.email }).toArray();
    // console.log(result);
    res.send({
      success: true,
      data: result
    });
  }
  catch (error) {
    console.log(error);
    res.send({
      status: 'error',
      message: error.message,
    });
  }
});


app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server listening on port ,${port}`);
});


