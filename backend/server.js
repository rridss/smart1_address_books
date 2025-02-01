const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const addressRoutes = require('./routes/addressRoutes'); // Make sure path is correct

const app = express();

app.use(bodyParser.json());  // Middleware to parse JSON requests

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err));

// Use the routes from the addressRoutes file
app.use('/api', addressRoutes);  // This will prepend '/api' to all routes in addressRoutes

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));
