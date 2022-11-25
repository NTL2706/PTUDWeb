const home_router = require("./homeRouter");
const product_router = require("./productRouter");

function route(app) {
    app.use("/", home_router);
    // app.use("/product", product_router);
}

module.exports = route;