//khai bao cac thu vien can thiet
const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const Handlebars = require("handlebars");
const cors = require("cors");
const helpers = require("./helpers/viewEngine.js");
const session = require("express-session");

const privateValue = require("./config/env");
const passport = require("./config/passport");
const db = require("./config/database");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
var corsOptions = {
    origin: "http://localhost:5000"
};
// todo cau hinh server
let PORT = privateValue.port;
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

//cau hinh passport
app.use(require('cookie-parser')());
app.set('trust proxy', 1) // trust first proxy
app.use(
  session({
    secret: "very secret keyboard cat",
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());
// body-parser
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));

const router = require("./routes/index");
db.connectMongoose();
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
