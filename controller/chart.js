const { Chart } = require("../database/Chart");

async function ChartSaved(req, res) {
  try {
    const { value, Id1, Id2 } = req.body;

    let userChart = await Chart.findOne({
      Id1,
      id2,
    });

    if (userChart?.Chart?.lenght !== 0) {
      let Chart = [value];
      userChart = await Chart.create({ Id1, Id2, Chart });
    } else {
      userChart.Chart.push(value);
      await Chart.updateOne(
        { Id: userChart.Id },
        { $set: { Chart: userChart.Chart } }
      );
    }

    return res.send({
      data: userChart.Chart,
    });
  } catch (err) {
    return res.status(500).send({
      error: "Something went wrong",
    });
  }
}

module.exports={
  ChartSaved,
}