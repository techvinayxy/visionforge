// Vercel catch-all function for the existing Express API routes.
// The Express app connects to MongoDB lazily and reuses warm-instance connections.
module.exports = require("../index");
