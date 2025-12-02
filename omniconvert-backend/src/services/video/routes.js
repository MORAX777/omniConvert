const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { upload } = require("../../middleware/upload");
router.get("/convert", (req, res) => res.json({ status: "Online", service: "Video" }));
router.post("/convert", upload.single("file"), controller.convertVideo);
module.exports = router;