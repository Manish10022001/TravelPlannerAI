const router = require("express").Router();
const { protect } = require("../middleware/auth");
const upload = require("../utils/fileHandler");
const { uploadDocuments } = require("../controllers/uploadController");

router.post("/", protect, upload.array("documents", 5), uploadDocuments);

module.exports = router;
