const Product = require("../models/Product");
const Category = require("../models/Category");
const utils = require("../utils/mongoose");
const utilsPagination = require("../utils/pagination");

async function getAllProduct(req, res) {
  let perPage = 6,
    page = Math.max(parseInt(req.param("page")) || 1, 1);
  if (req.param("page") == null) {
    page = 1;
  }

  const products = await Product.find({})
    .skip(perPage * (page - 1))
    .limit(perPage);

  const size = await Product.count({});
  const sizePage = Math.max(parseInt(size / perPage + 1));

  const categories = await Category.find({});
  const leftPage = await utilsPagination.getLeftPage(
    "/category",
    page,
    sizePage
  );
  const pagination = await utilsPagination.getPagination(
    "/category",
    page,
    sizePage
  );
  const rightPage = await utilsPagination.getRightPage(
    "/category",
    page,
    sizePage
  );

  let latestProducts = await Product.find({});
  latestProducts = latestProducts.slice(0, 3);
  res.render("shop-grid/shop-grid", {
    products: utils.mutipleMongooseToObject(products),
    size: size,
    currentPage: page,
    category: utils.mutipleMongooseToObject(categories),
    pagination: pagination,
    leftPage: leftPage,
    rightPage: rightPage,
    latestProducts: utils.mutipleMongooseToObject(latestProducts),
  });
}

//Get/:idCategory
async function getbyCategory(req, res) {
  let perPage = 6,
    page = Math.max(parseInt(req.param("page")) || 1, 1);
  if (req.param("page") == null) {
    page = 1;
  }

  let idCategory = req.param("idCategory");
  let name_Category = await Category.findOne({ "idCategory": idCategory });

  const products = await Product.find({
    "category": name_Category.name
  })
    .skip(perPage * (page - 1))
    .limit(perPage);

  const size = await Product.count({ "category": name_Category.name });
  const sizePage = Math.max(parseInt(size / perPage + 1));

  const categories = await Category.find({});
  const leftPage = await utilsPagination.getLeftPage(
    "/category/" + idCategory,
    page,
    sizePage
  );
  const pagination = await utilsPagination.getPagination(
    "/category/" + idCategory,
    page,
    sizePage
  );
  const rightPage = await utilsPagination.getRightPage(
    "/category/" + idCategory,
    page,
    sizePage
  );

  let latestProducts = await Product.find({});
  latestProducts = latestProducts.slice(0, 3);

  res.render("shop-grid/shop-grid", {
    products: utils.mutipleMongooseToObject(products),
    size: size,
    currentPage: page,
    category: utils.mutipleMongooseToObject(categories),
    pagination: pagination,
    leftPage: leftPage,
    rightPage: rightPage,
    latestProducts: utils.mutipleMongooseToObject(latestProducts),
  });
}

//Get /search?name= &minPrice= &maxPrice=
async function getProductBySearch(req, res) {
  let products = null;
  let name = req.query.name;
  let flag = false;
  let minPrice = 0;
  let maxPrice = 0;
  let size = 0;
  let leftPage = 0;
  let pagination = 0;
  let rightPage = 0;
  let sizePage = 0;

  let perPage = 6,
    page = Math.max(parseInt(req.query["page"]) || 1, 1);
  if (req.query["page"] == null) {
    page = 1;
  }

  if (req.query.minPrice && req.query.maxPrice) {
    flag = true;
    minPrice = req.query.minPrice;
    maxPrice = req.query.maxPrice;
  }

  if (flag) {
    products = await Product.find({
      "name": { $regex: name, $options: "i" }, "price": { $gte: minPrice, $lte: maxPrice },
    })
      .skip(perPage * (page - 1))
      .limit(perPage);

    size = await Product.count({
      "name": { $regex: name, $options: "i" },
      "price": { $gte: minPrice, $lte: maxPrice },
    });
    sizePage = Math.max(parseInt(size / perPage + 1));

    leftPage = await utilsPagination.getLeftPageSearch(
      "category/search?name=" +
      req.query.name +
      "&minPrice=" +
      req.query.minPrice +
      "&maxPrice=" +
      req.query.maxPrice,
      page,
      sizePage
    );
    pagination = await utilsPagination.getPaginationSearch(
      "category/search?name=" +
      req.query.name +
      "&minPrice=" +
      req.query.minPrice +
      "&maxPrice=" +
      req.query.maxPrice,
      page,
      sizePage
    );
    rightPage = await utilsPagination.getRightPageSearch(
      "category/search?name=" +
      req.query.name +
      "&minPrice=" +
      req.query.minPrice +
      "&maxPrice=" +
      req.query.maxPrice,
      page,
      sizePage
    );
  } else {
    products = await Product.find({
      "name": { $regex: name, $options: "i" }
    })
      .skip(perPage * (page - 1))
      .limit(perPage);
    size = await Product.count({
      name: { $regex: name, $options: "i" },
    });
    sizePage = Math.max(parseInt(size / perPage + 1));


    leftPage = await utilsPagination.getLeftPageSearch(
      "/category/search?name="
      + req.query.name,
      page,
      sizePage
    );
    pagination = await utilsPagination.getPaginationSearch(
      "/category/search?name="
      + req.query.name,
      page,
      sizePage
    );
    rightPage = await utilsPagination.getRightPageSearch(
      "/category/search?name="
      + req.query.name,
      page,
      sizePage
    );
  }

  const categories = await Category.find({});

  let latestProducts = await Product.find({
    name: { $regex: name, $options: "i" },
  });
  latestProducts = latestProducts.slice(0, 3);

  res.render("shop-grid/shop-grid", {
    products: utils.mutipleMongooseToObject(products),
    size: size,
    category: utils.mutipleMongooseToObject(categories),
    name,
    latestProducts: utils.mutipleMongooseToObject(latestProducts),
    pagination: pagination,
    leftPage: leftPage,
    rightPage: rightPage,
    minPrice,
    maxPrice,
  });
}

//Get/:idCategory/:idProduct
async function getbyIdproduct(req, res) {

  let idCategory = req.param("idCategory");
  let id_Product = req.param("idProduct");

  let select_Category = await Category.findOne({ "idCategory": idCategory });
  let select_Product = await Product.findOne({ "idProduct": id_Product });

  if (select_Product == null || select_Category == null) {
    res.redirect("/category");
    return;
  }

  let relate_Product = await Product.find({
    _id: { $in: select_Category.listIdProduct }
  })

  const categories = await Category.find({});
  await res.render("shop-details/shop-details", {
    product: utils.mutipleMongooseToObject(new Array(select_Product)),
    category: utils.mutipleMongooseToObject(new Array(select_Category)),
    relatedProduct: utils.mutipleMongooseToObject(relate_Product),
    listCategory: utils.mutipleMongooseToObject(categories),
  });
}

module.exports = {
  getAllProduct,
  getbyCategory,
  getbyIdproduct,
  getProductBySearch
};
