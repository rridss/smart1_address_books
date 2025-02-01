const express = require('express');
const router = express.Router();
const Address = require('../models/Address'); // Ensure the model path is correct

// GET route to fetch addresses based on search query
router.get('/api/addresses', async (req, res) => {
  try {
    const query = req.query.query || ''; // Get query parameter from URL
    const addresses = await Address.find({
      name: { $regex: query, $options: 'i' } // Case-insensitive search
    });

    res.json(addresses);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
