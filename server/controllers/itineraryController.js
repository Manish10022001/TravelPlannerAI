const Itinerary = require('../models/Itinerary');
const { generateItinerary } = require('../utils/documentParser');

// generate and save a new itinerary
exports.generate = async (req, res) => {
  try {
    const { extractedData, files } = req.body;
    if (!extractedData)
      return res.status(400).json({ message: 'No extracted data provided' });

    const itineraryData = await generateItinerary(extractedData);

    const itinerary = await Itinerary.create({
      user: req.user._id,
      ...itineraryData,
      extractedData,
      originalFiles: files || [],
    });

    res.status(201).json({ itinerary });
  } catch (err) {
    console.error('Generate error:', err);
    res.status(500).json({ message: err.message });
  }
};

// get all itineraries for logged in user
exports.getAll = async (req, res) => {
  try {
    const itineraries = await Itinerary.find({ user: req.user._id })
      .select('-extractedData -days')
      .sort({ createdAt: -1 });
    res.json({ itineraries });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// get one full itinerary by id
exports.getOne = async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      user: req.user._id, 
    });
    if (!itinerary)
      return res.status(404).json({ message: 'Itinerary not found' });
    res.json({ itinerary });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// delete one itinerary
exports.deleteOne = async (req, res) => {
  try {
    const itinerary = await Itinerary.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!itinerary)
      return res.status(404).json({ message: 'Itinerary not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// public share link for an itinerary
exports.share = async (req, res) => {
  try {
    const itinerary = await Itinerary.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!itinerary)
      return res.status(404).json({ message: 'Itinerary not found' });

    if (!itinerary.shareToken) itinerary.generateShareToken();
    await itinerary.save();

    const shareUrl = `${process.env.CLIENT_URL}/share/${itinerary.shareToken}`;
    res.json({ shareToken: itinerary.shareToken, shareUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};