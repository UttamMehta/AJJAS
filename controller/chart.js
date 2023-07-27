const { Chart } = require("../database/Chart");

async function register(req, res) {
  try {
    const { value, Id1, Id2 } = req.body;

    let userChart = await Chart.findOne({
      Id1,
      id2,
    });

    if (userChart?.Chart?.lenght !== 0)
      userChart = await Chart.create({ Id1, Id2, value });
    else {
      userChart.Chart.push(value);
      await Chart.updateOne(
        { Id: userChart.Id },
        { $set: { Chart: userChart.Chart } }
      );
    }

    return res.send({
      message: "Registration successful",
    });
  } catch (err) {
    return res.status(500).send({
      error: "Something went wrong",
    });
  }
}
