const router = require('express').Router();
const Itinerary = require('../models/Itinerary');

// public route
router.get('/:token', async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({
      shareToken: req.params.token,
      isShared: true,
    }).populate('user', 'name');

    if (!itinerary)
      return res.status(404).json({ message: 'Shared itinerary not found' });

    res.json({ itinerary });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;