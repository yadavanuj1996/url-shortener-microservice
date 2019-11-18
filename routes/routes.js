var express=require('express');
var api=express.Router();
var URL=require('../models/url').URL;
var searchURL=require('../models/url').searchURL;
var searchByShortURL=require('../models/url').searchByShortURL;
var insertURL=require('../models/url').insertURL;
var path=require('path');

api.post('/shorturl/new',async (req,res,next)=>{
  let originalURL=req.body.url;
  if(/^https?:\/\/www./.test(originalURL)){
    let insertedURLCode=await insertURL(originalURL);
    res.json({"original_url":originalURL,"short_url":insertedURLCode});
  }
  else{
    let err=new Error();
    err.code='INVALIDURL';
    return next(err);
  }
});

api.get('/shorturl/:shortURL',async (req,res,next)=>{
  if(/[a-zA-Z]/.test(req.params.shortURL)){
    let err=new Error();
    err.code='WRONGFORMAT';
    return next(err);
  }
  
  let urlDetails=await searchByShortURL(req.params.shortURL);
  
  if(urlDetails===null){
    let err=new Error();
    err.code='NOSHORTURL';
    return next(err);
  }

  res.redirect(`${urlDetails["originalURL"]}`);
});



module.exports=api;