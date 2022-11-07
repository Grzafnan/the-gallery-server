const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;
require('dotenv').config();


const app = express();

//middleware
app.use(cors());
app.use(express.json());




app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server listening on port ,${port}`);
});