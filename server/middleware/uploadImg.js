const upload = require("../config/upload");
const privateValue = require("../config/env");

const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;

const url = privateValue.urlMongo ;

const baseUrl = "http://localhost:5000/files/";

const mongoClient = new MongoClient(url);

async function uploadFile(req, res) {
    try {
        await upload(req, res);
        console.log(req.files);

        if (req.files.length <= 0) {
            console.log("You must select at least 1 file.")
            return "";
        }
        console.log("upload image successfully");
        return req.files;
    } catch (error) {
        console.log(error);
        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.send("Too many files to upload.");
        }
        return "";
    }
};

const getListFiles = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(privateValue.databaseVegetable);
        const images = database.collection(privateValue.imgBucket + ".files");

        const cursor = images.find({});

        if ((await cursor.count()) === 0) {
            return res.status(500).send({
                message: "No files found!",
            });
        }

        let fileInfos = [];
        await cursor.forEach((doc) => {
            fileInfos.push({
                name: doc.filename,
                url: baseUrl + doc.filename,
            });
        });

        return res.status(200).send(fileInfos);
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};

const download = async (req, res) => {
    try {
        await mongoClient.connect();

        const database = mongoClient.db(privateValue.databaseVegetable);
        const bucket = new GridFSBucket(database, {
            bucketName: privateValue.imgBucket,
        });

        let downloadStream = bucket.openDownloadStreamByName(req.params.name);

        downloadStream.on("data", function (data) {
            return res.status(200).write(data);
        });

        downloadStream.on("error", function (err) {
            return res.status(404).send({ message: "Cannot download the Image!" });
        });

        downloadStream.on("end", () => {
            return res.end();
        });
    } catch (error) {
        return res.status(500).send({
            message: error.message,
        });
    }
};

const deleteFile = async (req, res, fileName) => {
    const database = mongoClient.db(privateValue.databaseVegetable);
    const bucket = new GridFSBucket(database, {
        bucketName: privateValue.imgBucket,
    });
    bucket.find({ filename: fileName }).toArray((err, files) => {
        if (err) throw err;

        if (files.length === 0) {
            console.log("File not found");
            return false;
        }

        // Get the ID of the file
        const fileId = files[0]._id;

        // Delete the file
        bucket.delete(fileId, (err) => {
            if (err) throw err;

            console.log("File deleted successfully");
            return true;
        });
    });
}

module.exports = {
    uploadFile,
    getListFiles,
    download,
    deleteFile
};