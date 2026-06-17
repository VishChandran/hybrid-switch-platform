const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const transactionRoutes = require("./routes/transactionRoutes");
const adminRoutes = require("./routes/adminRoutes");
const { clientApiKeyAuth, adminApiKeyAuth } = require("./middleware/apiKeyAuth");
const { createRateLimiter } = require("./middleware/rateLimiter");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10kb" }));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    service: "Hybrid Switch Modernization Platform",
    version: "1.0.0",
    timestamp: new Date().toISOString()
  });
});

app.use(
  "/transactions",
  createRateLimiter({ windowMs: 60_000, maxRequests: 60 }),
  clientApiKeyAuth,
  transactionRoutes
);
app.use(
  "/admin",
  createRateLimiter({ windowMs: 60_000, maxRequests: 20 }),
  adminApiKeyAuth,
  adminRoutes
);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`HSMP running on port ${PORT}`);
  });
}

module.exports = { app };
