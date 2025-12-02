const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const uploadDir = "uploads/temp/";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = crypto.randomUUID(); 
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

exports.upload = multer({ 
    storage: storage,
    limits: { fileSize: 100 * 1024 * 1024 } 
});
