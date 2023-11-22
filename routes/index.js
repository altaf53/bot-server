const express = require("express");
const chatRoutes = require("./chat");

const apiRoutes = express.Router();

apiRoutes.use("/chat", chatRoutes);

module.exports = apiRoutes;
