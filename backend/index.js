require('dotenv').config();  // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const Address = require('./models/Address');  // Make sure model path is correct

// Initialize the app
const app = express();

// Middleware
app.use(express.json());  // Built-in middleware for parsing JSON

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Example endpoint to add an address
app.post('/api/addresses', async (req, res) => {
  try {
    const { name, address, pinCode, city, state, country } = req.body;
    const newAddress = new Address({ name, address, pinCode, city, state, country });

    await newAddress.save();
    res.status(201).json({ success: true, message: 'Address added successfully!', data: newAddress });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ success: false, message: 'Error adding address', error: error.message });
  }
});

// Route to fetch all addresses
app.get('/api/addresses', async (req, res) => {
  try {
    const addresses = await Address.find(); // Fetch all addresses from the database
    res.status(200).json(addresses);  // Send the list of addresses as JSON
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch addresses' });
  }
});

// Define port and start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
