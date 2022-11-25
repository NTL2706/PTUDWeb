// todo module dung de quan ly soucre code
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");

// todo cau hinh server
let PORT = process.env.PORT;
const app = express();

//todo server use
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.set("views", path.join(__dirname, "views"));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

const router = require("./routes/index");

// //todo cau hinh cua db
// const db = require("./config/db/index");

//todo database




//todo cac luong thu thi
router(app);

//todo server listen
if (PORT == null || PORT == "") {
    PORT = 3000;
}

app.listen(PORT, function () {
    console.log("Server has started successfully");
});

