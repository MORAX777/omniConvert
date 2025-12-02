const sharp = require("sharp");
const fs = require("fs/promises");
const path = require("path");

const outputDir = "uploads/processed/";
fs.mkdir(outputDir, { recursive: true }).catch(err => console.error(err));

exports.resizeImage = async (req, res, next) => {
    try {
        if (!req.file) throw new Error("No file uploaded");

        const { width, height, format } = req.body;
        const filename = `processed-${req.file.filename}`;
        const outputPath = path.join(outputDir, filename);

        await sharp(req.file.path)
            .resize(parseInt(width) || 800, parseInt(height) || 600)
            .toFormat(format || "jpeg")
            .toFile(outputPath);

        await fs.unlink(req.file.path);

        res.status(200).json({
            success: true,
            downloadUrl: `http://localhost:5000/uploads/processed/${filename}`
        });
    } catch (error) {
        if (req.file) await fs.unlink(req.file.path).catch(() => {});
        next(error);
    }
};
