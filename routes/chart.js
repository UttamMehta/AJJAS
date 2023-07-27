const express = require("express");
const { Chart } = require("../database/Chart");

const ChartRouter = express.Router();

YouTubeRouter.get("/", async (req, res) => {
  const { search, page } = req.query;
  let data = [];
  const currentDate = new Date();
  try {
    if (search && page) {
      data = await Youtubes.find({
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      })
        .limit(6)
        .skip(page * 5);
    } else if (search) {
      data = await Youtubes.find({
        $or: [
          { title: { $regex: search, $options: "i" } }, // Case-insensitive search for title
          { description: { $regex: search, $options: "i" } }, // Case-insensitive search for description
        ],
      }).limit(6);
    } else if (page) {
      data = await Youtubes.find({})
        .limit(6)
        .skip(page * 5);
    } else {
      data = await Youtubes.find({}).limit(6);
    }

    return res.send({ showdata: data });
  } catch (e) {
    return res.status(404).send({ error: "Unable to fetch Youtube data" });
  }
});

module.exports = ChartRouter;
