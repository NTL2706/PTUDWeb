//khai bao cac thu vien can thiet
const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const Handlebars = require("handlebars");
const cors = require("cors");
const {
    allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const helpers = require("./helpers/viewEngine.js");

const env = require("dotenv").config();

// todo cau hinh server
let PORT = process.env.PORT;
const app = express();

//cau hinh file hbs
app.engine(
    "hbs",
    exphbs({
        extname: ".hbs",
        defaultLayout: "main",
        handlebars: allowInsecurePrototypeAccess(Handlebars),
        helpers: helpers,
    })
);
app.set("view engine", "hbs");

// body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "/public")));


const router = require("./routes/index");

router(app);
//render layout error
app.use((req, res) => {
    res.render("errors/404", { layout: false });
});

app.use((err, req, res, next) => {
    console.log(err.message);
    res.status(500).render("errors/500", { layout: false, error: err.message });
});

//todo server listen
if (PORT == null || PORT == "") {
    PORT = 5000;
}

app.listen(PORT, function () {
    console.log("Server has started successfully");
});