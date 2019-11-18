var mongoose=require('mongoose');
// creating url schema for mongo db storage
var urlSchema=mongoose.Schema({
  originalURL: {type: String,required: true,unique: true},
  shortURL: {type: Number,required: true,unique: true}
});
// url model that will be used for creating documents
var URL=mongoose.model("URL",urlSchema); 

var searchURL=async (longURL)=>{
  let urlDetails=await URL.findOne({originalURL: longURL});
  return urlDetails;
};

var searchByShortURL=async (shortURL)=>{
  let urlDetails=await URL.findOne({shortURL: shortURL});
  return urlDetails;
};


var insertURL=async (longURL)=>{
  let urlAlreadyExists=await searchURL(longURL);
  if(urlAlreadyExists!==null){
    return urlAlreadyExists.shortURL;
  }
  let totalEntries=await URL.countDocuments({});
  let newURLEntry=new URL({originalURL: longURL,shortURL: totalEntries+1});
  let insertedURLEntry=await newURLEntry.save();
  return insertedURLEntry["shortURL"];
}
// exporting the model and other functions
exports.insertURL=insertURL;
exports.searchURL=searchURL;
exports.searchByShortURL=searchByShortURL;
exports.URL=URL;