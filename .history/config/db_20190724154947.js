const mongoose = require("mongoose");
const config = require("config");

const db = config.get("MongoURI");


const connectDb =  async ()=>{
    try{
      await mongoose.connect(db);
    }
    catch(err){

    }
    
}


