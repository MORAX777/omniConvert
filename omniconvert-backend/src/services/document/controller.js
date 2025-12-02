exports.convertDoc = async (req, res, next) => {
    try {
        if (!req.file) throw new Error("No file uploaded");
        // SIMULATION
        setTimeout(() => {
             res.status(200).json({
                success: true,
                message: "Document converted successfully (Simulated)",
                downloadUrl: "#",
                meta: { format: req.body.format || "pdf" }
            });
        }, 1500);
    } catch (error) { next(error); }
};