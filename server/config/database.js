const privateValue = require("./env");
const mongoose = require("mongoose");

//set up mongoose
mongoose.set('strictQuery', false);

async function connectMongoose() {
    console.log(privateValue.urlMongo + privateValue.databaseVegetable);
    try{
        await mongoose.connect(
            privateValue.urlMongo + privateValue.databaseVegetable,
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
