const sharp = require("sharp");
const fs = require("fs/promises");
const fsSync = require("fs");
const path = require("path");

const outputDir = "uploads/processed/";
// Ensure dirs exist at runtime
if (!fsSync.existsSync(outputDir)) fsSync.mkdirSync(outputDir, { recursive: true });

exports.resizeImage = async (req, res, next) => {
    console.log("Processing Image Request...");
    try {
        if (!req.file) throw new Error("No file uploaded");

        const { width, height, format } = req.body;
        const filename = `processed-${Date.now()}-${req.file.originalname}`;
        const outputPath = path.join(outputDir, filename);

        console.log(`Resizing to ${width}x${height}...`);

        // REAL PROCESSING
        await sharp(req.file.path)
            .resize(parseInt(width) || 800, parseInt(height) || 600)
            .toFormat(format || "jpeg")
            .toFile(outputPath);

        console.log("Resize Success!");

        // Cleanup input
        await fs.unlink(req.file.path).catch(e => console.log("Cleanup warning:", e.message));

        // Use the Render URL (Dynamically get the host)
        const protocol = req.protocol;
        const host = req.get("host");
        
        res.status(200).json({
            success: true,
            message: "Image processed successfully",
            downloadUrl: `${protocol}://${host}/uploads/processed/${filename}`,
            meta: { width, height, format }
        });

    } catch (error) {
        console.error("SHARP ERROR:", error);
        // If Sharp fails (common on free tier memory limits), fallback to mock
        res.status(500).json({ 
            success: false, 
            error: "Image Engine Error: " + error.message 
        });
    }
};