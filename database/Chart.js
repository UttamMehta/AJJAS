const mongoose = require("mongoose");

const ChartSchema = new mongoose.Schema(
  {
    id1: String,
    id2: String,
    chart: Array,
  },
  {
    timestamps: true,
  }
);

const Chart = mongoose.model("chart", ChartSchema); // collection - charts

module.exports = {
  Chart,
};
