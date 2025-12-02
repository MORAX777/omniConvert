const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

const { errorHandler } = require("./middleware/error");
const imageRoutes = require("./services/image/routes");
const audioRoutes = require("./services/audio/routes");
const videoRoutes = require("./services/video/routes");
const docRoutes = require("./services/document/routes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet()); 
app.use(cors());
app.use(compression());
app.use(express.json({ limit: "50mb" }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (req, res) => res.json({ status: "UP", service: "OmniConvert Gateway" }));

app.use("/api/v1/image", imageRoutes);
app.use("/api/v1/audio", audioRoutes);
app.use("/api/v1/video", videoRoutes);
app.use("/api/v1/document", docRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Enterprise Gateway running on port ${PORT}`);
});