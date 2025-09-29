const express = require("express");
const app = express();
const cors = require("cors");
// Removed unused bodyParser and fileUpload imports
const userRoutes = require("./router/user.router");
const courseRoutes = require("./router/course.router");
const messageRoutes = require("./router/message.router");
const adminRoutes = require("./router/admin.router");
const askRoutes = require("./router/ask.router");
const searchRoutes = require("./router/search.router");
const structureRoutes = require("./router/genrateStructure.router");
const uploadRoutes = require("./router/uploadFile.router");
const embeddingRoutes = require("./router/embedding.router");
const gameRoutes = require("./router/game.router");
const config = require("./config/config");
const PORT = config.PORT;
const helmet = require("helmet");
const compression = require("compression");
const hpp = require("hpp");
const morgan = require("morgan");
const path = require("path");

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
// Removed conflicting bodyParser.json() and fileUpload() middleware

app.set("trust proxy", 1);
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // ✅ add PATCH here
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(helmet());
app.use(hpp());
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(morgan(config.NODE_ENV === "production" ? "combined" : "dev"));
// Import Sequelize models to trigger DB sync and logging
require("./db/models");

// Swagger UI (dev-only by default). To disable, set ENABLE_SWAGGER=false or run in production.
const enableSwagger =
  config.NODE_ENV !== "production" && process.env.ENABLE_SWAGGER !== "false";
if (enableSwagger) {
  try {
    const path = require("path");
    const swaggerUi = require("swagger-ui-express");
    const YAML = require("yamljs");
    const swaggerPath = path.join(__dirname, "Swagger", "openapi.yaml");
    const swaggerDocument = YAML.load(swaggerPath);
    app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log("Swagger UI enabled at /docs");
  } catch (e) {
    console.warn(
      "Swagger UI not enabled. Install swagger-ui-express and yamljs to enable."
    );
  }
}

//main api
// Middleware to set proper headers for game content
app.use(["/games"], (req, res, next) => {
  // Set CSP headers to allow game content
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "connect-src 'self'; " +
      "font-src 'self'; " +
      "object-src 'none'; " +
      "media-src 'self'; " +
      "frame-src 'self';"
  );

  // Set other security headers
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "ALLOWALL");
  res.setHeader("X-XSS-Protection", "1; mode=block");

  next();
});

// Serve static files from public directory
app.use("/games", express.static(path.join(__dirname, "public/games")));
app.use("/img", express.static(path.join(__dirname, "public/img")));
app.use("/api/users", userRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/game", gameRoutes);
app.use("/ask", askRoutes);
app.use("/search", searchRoutes);
app.use("/genrateStructure", structureRoutes);
app.use("/uploadFile", uploadRoutes);
app.use("/embedding", embeddingRoutes);

// 404
app.use((req, res) => res.status(404).json({ error: "Not found" }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal server error" });
});

// Also handle unhandled rejections and exceptions at process level
process.on("unhandledRejection", (r) => console.error(r));
process.on("uncaughtException", (e) => {
  console.error(e);
  process.exit(1);
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
