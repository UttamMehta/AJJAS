const mongoose = require("mongoose");

const ChartSchema = new mongoose.Schema(
  {
    id: ObjectId,
    Id1: String,
    Id2: String,
    Chart: Array,

  },
  {
    timestamps:false,
  }
);

const Chart = mongoose.model("chart", ChartSchema); // collection - charts

module.exports = {
  Chart,
};
