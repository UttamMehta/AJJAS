const express = require("express");
const { Chart } = require("../database/Chart");

const ChartRouter = express.Router();

ChartRouter.get("/chat", async (req, res) => {
  try {
    return res.send({ data: "hello" });
  } catch (e) {
    return res.status(404).send({ error: "Unable to fetch Youtube data" });
  }
});

module.exports = ChartRouter;
