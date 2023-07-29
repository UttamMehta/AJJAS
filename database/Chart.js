const mongoose = require("mongoose");

const ChartSchema = new mongoose.Schema(
  {
    Id1: String,
    Id2: String,
    Chat: Array,
  },
  {
    timestamps:true,
  }
);

const Chart = mongoose.model("chart", ChartSchema); // collection - charts

module.exports = {
  Chart,
};
