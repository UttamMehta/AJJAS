// require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
// const path = require("path");
const http = require("http");
const {Server}=require("socket.io");
const {ChartSaved}=require("./controller/chart");
const { Chart } = require("./database/Chart");

const connectDatabase = require("./config/connectDatabase");


const ChartRouter = require("./routes/chart");
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

app.use("/chart", ChartRouter);

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
  socket.on("chat",async(msg)=>{
   const {Id1,Id2,Message}=msg;

   let userChart ={};
   if(!Id1||!Id2||!Message){
    socket.emit(Id1,"Incorrect data");
   }
   else{
    try {
       userChart = await Chart.findOne({$or: [
        { Id1, Id2},
        {Id1: Id2, Id2:Id1 },
      ],});
      // console.log(userChart);
      if (userChart===null) {
        let Chat = [];
        Chat.push(Message);
        let obj={Id1,Id2,Chat};
        console.log(obj);
        userChart = await Chart.create(obj);
      } else {
        let newChart=userChart.Chat;
        newChart.push(Message);
        await Chart.updateOne(
          { _Id: userChart._Id },
          { $set: { Chat: [...newChart] } }
        )

        // console.log(userChart);
      }

      if(Object.keys(userChart).length!==0)
    { 
      let err=false;
       socket.emit(Id1,userChart.Chat,err);
      socket.emit(Id2,userChart.Chat,err);
    }
      else{
        let err=true
        socket.emit(Id1,err);
      }
    } catch (err) {
     console.log("err on 81");
    }}
})

socket.on("disconnect",()=>{
  count--;
console.log("disconnected");
webshocketserver.emit("xyz",count);
})
})







