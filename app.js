const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const appRoutes = require("./routes");
require("dotenv").config();
app.use(express.json());
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.json({ message: "Bot server 1.0.0" });
});

app.use("/app", appRoutes);

const db = mongoose.connection;
db.once("open", () => {
  console.log("Connected to MongoDB");
});
db.on("error", (err) => {
  console.error("Connection error:", err);
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`API server listening on port ${port}`));
