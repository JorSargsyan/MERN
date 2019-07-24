const mongoose = require("mongoose");
const config = require("config");

const db = config.get("MongoURI");


const connectDb =  async ()=>{
    try{
      await mongoose.connect(db,{useNewUrlParser:true});
        console.log("DB is connected");
    }
    catch(err){
        console.log(err);
        //exit process with failure
        process.exit(1)
    }
    
}

module.exports =  connectDb;

