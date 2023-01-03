require("dotenv").config({});

module.exports = {
    urlMongo: process.env.URL_MONGO,
    databaseImg: process.env.DATABASE_IMG,
    databaseVegetable: process.env.DATABASE_VEGETABLE,
    imgBucket: process.env.IMG_BUCKET,
    port: process.env.port
}