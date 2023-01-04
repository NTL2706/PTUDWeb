const home_router = require("./homeRouter");
const admin_router = require("./adminRouter");
const user_router = require("./acountUserRouter");
const product_router = require("./productRouter");
const order_router = require("./orderRouter");

function route(app) {
    app.use("/", home_router);
    app.use("/admin", admin_router);
    app.use("/user", user_router);
    app.use("/product", product_router);
    app.use("/orders", order_router);
}

module.exports = route;