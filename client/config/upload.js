const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const privateValue = require("./env");

var storage = new GridFsStorage({
    url: privateValue.urlMongo + privateValue.databaseVegetable,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        const match = ["image/png", "image/jpeg"];

        if (match.indexOf(file.mimetype) === -1) {
            const filename = `${Date.now()}-bezkoder-${file.originalname}`;
            return filename;
        }

        return {
            bucketName: privateValue.imgBucket,
            filename: `${Date.now()}-bezkoder-${file.originalname}`
        };
    }
});

var uploadFiles = multer({ storage: storage }).array("multi-files", 10);
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;