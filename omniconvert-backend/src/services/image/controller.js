const sharp = require("sharp");
const fs = require("fs/promises");
const fsSync = require("fs");
const path = require("path");

const outputDir = "uploads/processed/";
if (!fsSync.existsSync(outputDir)) fsSync.mkdirSync(outputDir, { recursive: true });

// 1. RESIZE LOGIC
exports.resizeImage = async (req, res, next) => {
    try {
        if (!req.file) throw new Error("No file uploaded");

        const { width, height, format } = req.body;
        const filename = `processed-${Date.now()}-${req.file.originalname}`;
        const outputPath = path.join(outputDir, filename);

        await sharp(req.file.path)
            .resize(parseInt(width) || 800, parseInt(height) || 600)
            .toFormat(format || "jpeg")
            .toFile(outputPath);

        // Cleanup
        await fs.unlink(req.file.path).catch(() => {});

        // CONSTRUCT API URL (Not static file URL)
        // This points to the new download function below
        const protocol = req.headers["x-forwarded-proto"] || req.protocol;
        const host = req.get("host");
        const downloadUrl = `${protocol}://${host}/api/v1/image/download/${filename}`;
        
        res.status(200).json({
            success: true,
            message: "Image processed",
            downloadUrl: downloadUrl
        });

    } catch (error) {
        console.error("Processing Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// 2. DOWNLOAD LOGIC (The Fix)
exports.downloadImage = (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(outputDir, filename);

    // Security Check: Prevent "Directory Traversal" attacks
    if (filename.includes("..")) return res.status(400).send("Invalid filename");

    // "res.download" automatically sets Content-Disposition: attachment
    // This FORCES the browser to download, even across domains.
    res.download(filePath, filename, (err) => {
        if (err) {
            console.error("Download Error:", err);
            if (!res.headersSent) res.status(404).send("File not found or expired.");
        }
    });
};