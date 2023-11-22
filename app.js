const express = require("express");
const app = express();
const appRoutes = require("./routes");
require("dotenv").config();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Bot server 1.0.0" });
});

app.use("/app", appRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API server listening on port ${port}`));
