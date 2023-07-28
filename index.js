// require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
// const path = require("path");
const http = require("http");
const {Server}=require("socket.io");

const connectDatabase = require("./config/connectDatabase");


// const ChartRouter = require("./routes/chart");
// const AuthRouter = require("./routes/auth");

const app = express();
const server=http.createServer(app);

const webshocketserver=new Server(server);

app.all("/", (req, res) => {
  console.log("Just got a request!");
  res.send("Hello");
});

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

app.get("/hello", (req, res, next) => {
  res.send("Hello there");
  next();
});

// app.use("/auth", AuthRouter);

// app.use("/chart", ChartRouter);

const port = process.argv[2] || 3035;

connectDatabase().then(() => {
  server.listen(port, () => {
    console.log(
      `Server listening to http requests on http://localhost:${port}`
    );
  });
});
let count=0;

webshocketserver.on("connection",(socket)=>{
count++;
  socket.emit("xyz",count);

  socket.on("chat",(msg)=>{
    console.log(msg)
  })
})









