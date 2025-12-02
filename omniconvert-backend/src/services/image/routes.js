const express = require("express");
const router = express.Router();
const controller = require("./controller");
const { upload } = require("../../middleware/upload");

router.get("/resize", (req, res) => res.json({ status: "Online", message: "Ready" }));
router.post("/resize", upload.single("file"), controller.resizeImage);

module.exports = router;
