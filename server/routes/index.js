const home_router = require("./homeRouter");
const admin_router = require("./adminRouter");
const user_router = require("./acountUserRouter");
const product_router = require("./productRouter");

function route(app) {
    app.use("/", home_router);
    app.use("/admin", admin_router);
    app.use("/user", user_router);
    app.use("/product", product_router);
}

module.exports = route;