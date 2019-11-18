'use strict';

var express= require('express');
var app=express();
var mongoose=require('mongoose');
var port=process.env.PORT || 3000;
var cors=require('cors');
var path=require('path');
var api=require('./routes/routes');
var bodyParser=require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true ,useUnifiedTopology: true,useCreateIndex: true});
// for post requests reading req body details
app.use(bodyParser.urlencoded({extended: false}));

app.use(cors({Status: 200}));



app.use('/public', express.static(path.join(__dirname,'/public')));

app.get('/',(req,res,next)=>{
  res.sendFile(path.join(__dirname,'views','index.html'));
});

app.use('/api',api);

app.use((req,res,next)=>{
  res.status(404);
  res.send('Page Not Found');
});

app.use((err,req,res,next)=>{
  if(err.code==="WRONGFORMAT"){
    return res.json({"error":"Wrong Format"});
  }
  else if(err.code==="NOSHORTURL"){
    return res.json({"error":"No short url found for given input"});
  }
  else if(err.code==="INVALIDURL"){
    return res.json({"error":"Invalid URL"});
  }
  console.log(err);
  res.status(500);
  res.send('Internal Server Error');
});

  
var listener=app.listen(port,()=>{
  console.log("Server listening at port: "+listener.address().port);
});