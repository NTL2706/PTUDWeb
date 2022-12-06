const env = require("dotenv");
const mongoose = require("mongoose");

//set up mongoose
mongoose.set('strictQuery', false);

async function connectMongoose() {
    try{
        await mongoose.connect(
            "mongodb://127.0.0.1:27017",
            { useNewUrlParser: true, useUnifiedTopology: true },
            () => {
                console.log("Connected to MongoDB");
            }
        );
    }
    catch(e){
        console.log("Disconnect to mongoDB");
    }
}

module.exports = {connectMongoose};
