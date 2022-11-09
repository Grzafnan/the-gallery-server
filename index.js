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


// ALl reviews api

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


//  Delete api 
app.delete('/my-review/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const review = await Reviews.findOne({ _id: ObjectId(id) });

    if (!review?._id) {
      res.send({
        success: false,
        error: "Review doesn't exist",
      });
      return;
    }

    const result = await Reviews.deleteOne({ _id: ObjectId(id) });

    if (result.deletedCount) {
      res.send({
        success: true,
        message: `Successfully deleted the review`,
      });
    } else {
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});



app.get("/my-review/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Reviews.findOne({ _id: ObjectId(id) });

    res.send({
      success: true,
      data: review,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});


app.put("/my-review/:id", async (req, res) => {
  const { id } = req.params;
  const query = { _id: ObjectId(id) };
  const status = req.body.message;
  // console.log(status);
  const updatedDoc = {
    $set: {
      message: status
    }
  }

  try {
    const result = await Reviews.updateOne(query, updatedDoc);
    if (result.matchedCount) {
      res.send({
        success: true,
        message: `successfully updated the review`,
      });
    } else {
      res.send({
        success: false,
        error: "Couldn't update  the Review",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});









app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server listening on port ,${port}`);
});


