// todo module dung de quan ly soucre code
const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const expressHandlebarsSections = require("express-handlebars-sections");
const path = require("path");

// todo cau hinh server
let PORT = process.env.PORT;
const app = express();

//todo server use
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
expressHandlebarsSections(hbs);

app.engine("hbs", hbs.engine);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json());

const router = require("./routes/index");

// //todo cau hinh cua db
// const db = require("./config/db/index");

//todo database




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

