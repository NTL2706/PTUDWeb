const Product = require("../models/product.model");
const Category = require("../models/category.model");

const to_slug = require("../public/js/slug.js");
const product = {
  getCategoryView: async function (req, res) {
    if (req.user) {
      let perPage = 2; // số lượng sản phẩm xuất hiện trên 1 page
      let page = req.query.page || 1; // số page hiện tại
      if (page < 1) {
        page = 1;
      }

      Category.find() // find tất cả các data
        .skip(perPage * page - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
        .limit(perPage)
        .exec((err, categories) => {
          Category.countDocuments(async (err, count) => {
            // đếm để tính có bao nhiêu trang
            if (err) return next(err);
            const listProducts = [];

            for (let i = 0; i < categories.length; i++) {
              const product = await Product.find({
                _id: { $in: categories[i].listIdProduct },
              });

              listProducts.push(product);
            }
            let isCurrentPage;
            const pages = [];
            for (let i = 1; i <= Math.ceil(count / perPage); i++) {
              if (i === +page) {
                isCurrentPage = true;
              } else {
                isCurrentPage = false;
              }
              pages.push({
                page: i,
                isCurrentPage: isCurrentPage,
              });
            }
            res.render("category/list-category", {
              categories,
              pages,
              isNextPage: page < Math.ceil(count / perPage),
              isPreviousPage: page > 1,
              nextPage: +page + 1,
              previousPage: +page - 1,
              products: listProducts,
              length: listProducts.length,
            });
          });
        });
    }
  },
  getAddCategory: async function (req, res) {
    if (req.user) {
      return res.render("category/add-category");
    }
    return res.redirect("/admin/login");
  },

  postAddCategory: async function (req, res) {
    if (req.user) {
      const category = new Category({
        name: req.body.name,
        idCategory: to_slug(req.body.name) + "-" + Date.now(),
        image: req.body.image,
        listIdProduct: [],
      });

      category.save((err) => {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/");
        }
      });
    }
  },
};

module.exports = product;
