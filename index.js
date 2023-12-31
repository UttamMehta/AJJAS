// require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
// const path = require("path");
const http = require("http");
const {Server}=require("socket.io");
// const {ChartSaved}=require("./controller/chart");
const { Chart } = require("./database/Chart");

const connectDatabase = require("./config/connectDatabase");


// const ChartRouter = require("./routes/chart");
// const AuthRouter = require("./routes/auth");

const app = express();
app.all("/", (req, res) => {
  console.log("Just got a request!");
  res.send("Hello");
});

app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

app.get("/hello", (req, res, next) => {
  res.send("Hello there app");
  next();
});

// app.use("/auth", AuthRouter);

// app.use("/chart", ChartRouter);



const port = process.argv[2] || 3035;

const server=http.createServer(app);

const webshocketserver=new Server(server);

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
  let userChart ={};
  socket.on("show",async(msg)=>{
    const {Id1,Id2}=msg;
     if(Id1&&Id2){
      userChart = await Chart.findOne({$or: [
        { Id1, Id2},
        {Id1: Id2, Id2:Id1 },
      ],});

      if(userChart!==null)
      { 
        let err=false;
        let chat=userChart.Chat;
        webshocketserver.emit(Id1+Id2,{chat,err});
        webshocketserver.emit(Id2+Id2,{chat,err});
      }
        else{
          let err=true;
         webshocketserver.emit(Id1+Id2,{err});
        webshocketserver.emit(Id2+Id1,{err});
        }

     }
  })

  socket.on("chat",async(msg)=>{
    userChart={};
   const {Id1,Id2,Message}=msg;
   if(!Id1||!Id2||!Message){
    socket.emit(Id1,"Incorrect data");
   }
   else{
    try {
       userChart = await Chart.findOne({$or: [
        { Id1, Id2},
        {Id1: Id2, Id2:Id1 },
      ],});
      if (userChart===null||Object.keys(userChart).length===0) {
        let Chat = [];
        Chat.push(Message);
        let obj={Id1,Id2,Chat};
        userChart = await Chart.create(obj);
      } else {
       
        userChart.Chat.push(Message);
        let useabc=userChart.Chat;
        let filter={_id:userChart._id};
        let update={$set:{Chat:[...useabc]}};
        await Chart.updateOne(filter,update);

      }

      if(Object.keys(userChart).length!==0)
    { 
      let err=false;
      let chat=userChart.Chat;
   socket.emit(Id1+Id2,{chat,err,line:"111"});
      webshocketserver.emit(Id2+Id1,{chat,err,line:"112"});
    }
      else{
        let err=true;
        socket.emit(Id1+Id2,err);
      }
    } catch (error) {
      let err=true;
      socket.emit(Id1+Id2,err);
     console.log("err on 81");
    }}
})

socket.on("disconnect",()=>{
  count--;
console.log("disconnected");
webshocketserver.emit("xyz",count);
})
})







