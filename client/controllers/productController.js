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
  console.log("hello");
  console.log(page);

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
  console.log("hello");
  let idCategory = req.param("idCategory");
  console.log(idCategory);
  let name_Category = await Category.findOne({"idCategory": idCategory});
  
  const products = await Product.find({
    "category": name_Category.name})
    .skip(perPage * (page - 1))
    .limit(perPage);

  const size = await Product.count({"category": name_Category.name});
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

module.exports = {
  getAllProduct,
  getbyCategory,
};
