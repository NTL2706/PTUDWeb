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
    "/shop-grid",
    page,
    sizePage
  );
  const pagination = await utilsPagination.getPagination(
    "/shop-grid",
    page,
    sizePage
  );
  const rightPage = await utilsPagination.getRightPage(
    "/shop-grid",
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

  const size = await Product.count({});
  const sizePage = Math.max(parseInt(size / perPage + 1));

  const categories = await Category.find({});
  const leftPage = await utilsPagination.getLeftPage(
    "/shop-grid",
    page,
    sizePage
  );
  const pagination = await utilsPagination.getPagination(
    "/shop-grid",
    page,
    sizePage
  );
  const rightPage = await utilsPagination.getRightPage(
    "/shop-grid",
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

//Get/:idCategory/:idProduct
async function getbyIdproduct(req,res){
  
  let idCategory = req.param("idCategory");
  let id_Product = req.param("idProduct");

  let select_Category = await Category.findOne({"idCategory": idCategory});
  let select_Product = await Product.findOne({"idProduct": id_Product});
    
  if (select_Product == null || select_Category == null){
    res.redirect("/category");
    return;
  }

  let relate_Product = await Product.find({
    _id: {$in: select_Category.listIdProduct}
  })
  
  console.log(relate_Product);
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
  getbyIdproduct
};
