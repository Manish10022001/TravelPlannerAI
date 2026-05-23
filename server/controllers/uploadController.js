const { extractTravelData } = require("../utils/documentParser");

exports.uploadDocuments = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: "No files uploaded" });

    // send files to AI for extraction
    const extractedData = await extractTravelData(req.files);

    // return file metadata so frontend can pass it to generate step
    const filesMeta = req.files.map((f) => ({
      filename: f.filename,
      originalName: f.originalname,
      mimetype: f.mimetype,
      size: f.size,
    }));

    res.json({ extractedData, files: filesMeta });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: err.message });
  }
};
