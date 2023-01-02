// todo module dung de quan ly soucre code
const express = require("express");
const bodyParser = require("body-parser");
const expressHandlebarsSections = require("express-handlebars-sections");
const path = require("path");
const numeral = require("numeral");
const session = require("express-session");
const exphbs = require("express-handlebars");
require("dotenv");
// todo cau hinh router
const router = require("./routes/index");
// //todo cau hinh  config
const db = require("./config/database");
const passport = require("./config/passport");
const apiShoppingCartRouter = require("./api/shopping-cart");
const sessionHandler = require("./middlewares/sessionHandler");
const userShoppingCart = require("./middlewares/userShoppingCart");
// todo cau hinh server
let PORT = process.env.PORT;
//todo cau hinh hbs
const hbs = exphbs.create({
  extname: "hbs",
  defaultLayout: "main",
  layoutsDir: __dirname + "/views/layouts",
  partialsDir: __dirname + "/views/partials",
  helpers: {
    // Function to do basic mathematical operation in handlebar
    math: function (lvalue, operator, rvalue) {
      lvalue = parseFloat(lvalue);
      rvalue = parseFloat(rvalue);
      return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue,
      }[operator];
    },
    format: (val) => numeral(val).format("0,0") + " đ",
    time: (val, current, block) => {
      var accum = "";
      for (var i = 0; i < val; ++i) accum += block.fn(i + current);
      return accum;
    },
    currentPage: (val, block) => {
      var accum = "";
      accum += block.fn(val);
      return accum;
    },
    rightPage: (val) => Number(val) + 1,
    leftPage: (val) => Number(val) - 1,
    addTwo: (val) => Number(val) + 2,
    ifCond: (v1, operator, v2, options) => {
      switch (operator) {
        case "==":
          return v1 == v2 ? options.fn(this) : options.inverse(this);
        case "===":
          return v1 === v2 ? options.fn(this) : options.inverse(this);
        case "!=":
          return v1 != v2 ? options.fn(this) : options.inverse(this);
        case "!==":
          return v1 !== v2 ? options.fn(this) : options.inverse(this);
        case "<":
          return v1 < v2 ? options.fn(this) : options.inverse(this);
        case "<=":
          return v1 <= v2 ? options.fn(this) : options.inverse(this);
        case ">":
          return v1 > v2 ? options.fn(this) : options.inverse(this);
        case ">=":
          return v1 >= v2 ? options.fn(this) : options.inverse(this);
        case "&&":
          return v1 && v2 ? options.fn(this) : options.inverse(this);
        case "||":
          return v1 || v2 ? options.fn(this) : options.inverse(this);
        default:
          return options.inverse(this);
      }
    },

    pageIf: (currentPage, operator, value, options) => {
      switch (operator) {
        case "==":
          return currentPage == value
            ? options.fn(currentPage)
            : options.inverse(currentPage);
        default:
          return options.inverse(this);
      }
    },
  },
});

const app = express();
//todo server use
expressHandlebarsSections(hbs);
app.engine("hbs", hbs.engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "/public")));

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(require("cookie-parser")());
app.use(
  session({
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 365,
    },
    resave: true,
    saveUninitialized: true,
    secret: "cats",
  })
);
app.use(passport.initialize());
app.use(passport.session());

//todo database
db.connectMongoose();

//todo use api router shoping card
app.use(sessionHandler);
app.use("/api/shoppingCart", apiShoppingCartRouter);
app.use(userShoppingCart);
//todo cac luong thu thi
router(app);

//todo render error
app.use((req, res) => {
  res.render("errors/404", { layout: false });
});

//todo server listen
if (PORT == null || PORT == "") {
  PORT = 3000;
}
app.listen(PORT, function () {
  console.log("Server has started successfully");
});
