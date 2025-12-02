const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { upload } = require("../../middleware/upload");

router.get("/convert", (req, res) => res.json({ status: "Online", service: "Image" }));

// Upload Route
router.post("/resize", upload.single("file"), controller.resizeImage);

// NEW: Download Route
router.get("/download/:filename", controller.downloadImage);

module.exports = router;