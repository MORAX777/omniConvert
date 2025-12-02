exports.convertVideo = async (req, res, next) => {
    try {
        if (!req.file) throw new Error("No file uploaded");
        // SIMULATION
        setTimeout(() => {
             res.status(200).json({
                success: true,
                message: "Video processed successfully (Simulated)",
                downloadUrl: "#",
                meta: { format: req.body.format || "mp4" }
            });
        }, 3000);
    } catch (error) { next(error); }
};