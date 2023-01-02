const Product = require("../models/product.model");
const Category = require("../models/category.model");
const Producer = require("../models/producer.model");
const to_slug = require("../public/js/slug.js");
const uploadImg = require("../middleware/uploadImg");
const upload = require("../config/upload");

const product = {
  getCategoryView: async function (req, res) {
    if (req.user) {
      let perPage = 1;
      let page = req.query.page || 1;
      if (page < 1) {
        page = 1;
      }

      Category.find()
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec((err, categories) => {
          Category.countDocuments(async (err, count) => {
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
    } else {
      res.redirect("/admin/login");
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
      const files = await uploadImg.uploadFile(req, res);
      let filesname = "";
      if (files != "") {
        filesname = files[0].filename;
      }
      const category = new Category({
        name: req.body.name,
        idCategory: to_slug(req.body.name) + "-" + Date.now(),
        image: filesname,
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

  getEditCategory: async function (req, res) {
    if (req.user) {
      Category.findById(req.params.id, (err, category) => {
        if (err) console.log(err);
        else {
          res.render("category/edit-category", {
            category,
          });
        }
      });
    }
  },

  postEditCategory: async function (req, res) {
    if (req.user) {
      const files = await uploadImg.uploadFile(req, res);
      let filename = "";
      if (files != "") {
        filename = files[0].filename;
      }

      const category = await Category.findById(req.body.id);
      await uploadImg.deleteFile(req, res, category.image);

      const idCategory = to_slug(req.body.name) + "-" + Date.now();
      const listIdProduct = category.listIdProduct;

      for await (let idProduct of listIdProduct) {
        let product = await Product.findById(idProduct);
        let url = idCategory + "/" + product.idProduct;
        await Product.findByIdAndUpdate(idProduct, {
          url: url,
        });
      }

      Category.findByIdAndUpdate(
        req.body.id,
        {
          name: req.body.name,
          image: filename,
          idCategory: idCategory,
        },
        (err, category) => {
          if (err) {
            console.log(err);
          } else {
            res.redirect("/product/show-category?page=1");
          }
        }
      );
    }
  },

  getDeleteCategory: async (req, res) => {
    const category = await Category.findById(req.params.id);
    const listIdProduct = category.listIdProduct;
    await uploadImg.deleteFile(req, res, category.image);

    for (let i = 0; i < listIdProduct.length; i++) {
      await Product.findByIdAndDelete(listIdProduct[i]);
    }

    await Category.findByIdAndDelete(req.params.id);
    res.redirect("/product/show-category?page=1");
  },

  getShowProducer: async function (req, res) {
    if (req.user) {
      let perPage = 1;
      let page = req.query.page || 1;
      if (page < 1) {
        page = 1;
      }

      Producer.find()
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec((err, producers) => {
          Producer.countDocuments(async (err, count) => {
            if (err) return next(err);
            const listProducts = [];

            for (let i = 0; i < producers.length; i++) {
              const product = await Product.find({
                _id: { $in: producers[i].listIdProduct },
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
            res.render("./producer/list-producer", {
              producers,
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
    } else {
      res.redirect("/admin/login");
    }
  },

  getAddProducer: async function (req, res) {
    if (req.user) {
      res.render("./producer/add-producer");
    } else {
      res.redirect("/admin/login");
    }
  },

  postAddProducer: async function (req, res) {
    if (req.user) {
      const producer = new Producer({
        name: req.body.name,
        listIdProduct: [],
      });
      await producer.save();
      res.redirect("/product/producer?page=1");
    } else {
      res.redirect("/admin/login");
    }
  },

  postAddProducer: async function (req, res) {
    if (req.user) {
      const producer = new Producer({
        name: req.body.name,
        listIdProduct: [],
      });
      await producer.save();
      res.redirect("/product/show-producer?page=1");
    } else {
      res.redirect("/admin/login");
    }
  },

  getEditProducer: async function (req, res) {
    if (req.user) {
      Producer.findById(req.params.id, (err, producer) => {
        if (err) {
          console.log(err);
        } else {
          res.render("./producer/edit-producer", {
            producer,
          });
        }
      });
    } else {
      res.redirect("/admin/login");
    }
  },

  postEditProducer: async function (req, res) {
    if (req.user) {
      Producer.findByIdAndUpdate(
        req.body.id,
        {
          name: req.body.name,
        },
        (err, category) => {
          if (err) {
            console.log(err);
          } else {
            res.redirect("/product/show-producer?page=1");
          }
        }
      );
    } else {
      res.redirect("/admin/login");
    }
  },

  getDeleteProducer: async function (req, res) {
    if (!req.user) {
      res.redirect("/admin/login");
      return;
    }
    const producer = await Producer.findById(req.params.id);
    const listIdProduct = producer.listIdProduct;

    for (let i = 0; i < listIdProduct.length; i++) {
      await Product.findByIdAndDelete(listIdProduct[i]);
    }

    await Producer.findByIdAndDelete(req.params.id);
    res.redirect("/product/show-producer?page=1");
  },

  getShowProduct: async function (req, res) {
    if (!req.user) {
      res.redirect("/admin/login");
      return;
    }
    let perPage = 6;
    let page = req.query.page || 1;
    if (page < 1) {
      page = 1;
    }

    Product.find() // find tất cả các data
      .skip(perPage * page - perPage) // Trong page đầu tiên sẽ bỏ qua giá trị là 0
      .limit(perPage)
      .exec((err, product) => {
        Product.countDocuments((err, count) => {
          // đếm để tính có bao nhiêu trang
          if (err) return next(err);
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
          res.render("product/list-product", {
            product,
            pages,
            isNextPage: page < Math.ceil(count / perPage),
            isPreviousPage: page > 1,
            nextPage: +page + 1,
            previousPage: +page - 1,
          });
        });
      });
  },

  getAddProduct: async function (req, res) {

    const category = await Category.find({});
    const producer = await Producer.find({});
    res.render("product/add-product", {
      category,
      producer,
    });
  },

  postAddProduct: async function (req, res) {
    let listImgExtra = [];
    const files = await uploadImg.uploadFile(req, res);
    if (files.length > 0) {
      for (let file of files) {
        listImgExtra.push(file.filename);
      }
    }  
    const category = await Category.findById(req.body.id_category);
    console.log(req.body.id_category);
    const idProduct = to_slug(req.body.name) + "-" + Date.now();
    const url = category.idCategory + "/" + idProduct;

    const product = new Product({
      name: req.body.name,
      details: req.body.details,
      quantity: req.body.quantity,
      price: req.body.price,
      image: listImgExtra[0],
      listImgExtra: listImgExtra,
      category: req.body.category,
      producer: req.body.producer,
      idProduct: idProduct,
      listIdRating: [],
      url: url,
    });

    product.save((err) => {
      if (err) {
        console.log(err);
        res.render("product/add-product", {
          msg: err,
        });
      } else {
        // find category and push product id
        Category.findByIdAndUpdate(
          req.body.id_category,
          {
            $push: {
              listIdProduct: product._id,
            },
          },
          (err, cha) => {
            if (err) {
              console.log(err);
            } else {
              // find producer and push product id
              Producer.findByIdAndUpdate(
                req.body.id_producer,
                {
                  $push: {
                    listIdProduct: product._id,
                  },
                },
                (err, pro) => {
                  if (err) {
                    console.log(err);
                  } else {
                    res.redirect("/product/show-product?page=1");
                  }
                }
              );
            }
          }
        );
      }
    });

  },

  getEditProduct: async function (req, res) {
    if (req.user) {
      // find all category using async await
      const category = await Category.find({});
      const producer = await Producer.find({});

      // find id category that have this product id in listIdProduct
      Product.findById(req.params.id, (err, product) => {
        if (err) {
          console.log(err);
          return;
        }
        Category.find(
          { listIdProduct: product._id },
          (err, currentCategory) => {
            if (err) {
              console.log(err);
              return;
            }
            res.render("product/edit-product", {
              product,
              producer,
              category,
              idCurrentCategory: currentCategory[0]._id,
            });
          }
        );
      });
    }
  },

  postEditProduct: async function (req, res) {
    if (req.user) {
      // find product and update
      const files = await uploadImg.uploadFile(req, res);
      let filename = [];
      for (let file of files) {
        filename.push(file.filename);
      }

      const category = await Category.findById(req.body.id_category);
      let product = await Product.findById(req.body.id);
      if (product.listImgExtra.length > 0) {
        for (let img of product.listImgExtra) {
          await uploadImg.deleteFile(req, res, img);
        }
      }

      const idProduct = to_slug(req.body.name) + "-" + Date.now();
      const url = category.idCategory + "/" + idProduct;

      product = await Product.findByIdAndUpdate(
        req.body.id,
        {
          $set: {
            name: req.body.name,
            details: req.body.details,
            quantity: req.body.quantity,
            price: req.body.price,
            image: filename[0],
            listImgExtra: filename,
            category: req.body.category,
            producer: req.body.producer,
            idProduct: idProduct,
            listIdRating: [],
            url: url,
          },
        },
        async (err, product) => {
          if (err) return next(err);
          // find old category and remove product id
          const currentCategory = await Category.find({
            listIdProduct: product._id,
          }).clone();
          // find category and remove product id
          await Category.findByIdAndUpdate(
            currentCategory[0]._id,
            {
              $pull: {
                listIdProduct: product._id,
              },
            },
            async (err, cha) => {
              if (err) {
                console.log(err);
              } else {
                // find category and push product id
                await Category.findByIdAndUpdate(
                  req.body.id_category,
                  {
                    $addToSet: {
                      listIdProduct: product._id,
                    },
                  },
                  async (err, cha) => {
                    if (err) {
                      console.log(err);
                    } else {
                      // find old producer and remove product id
                      const currentProducer = await Producer.find({
                        listIdProduct: product._id,
                      }).clone();
                      // find producer and remove product id
                      await Producer.findByIdAndUpdate(
                        currentProducer[0]._id,
                        {
                          $pull: {
                            listIdProduct: product._id,
                          },
                        },
                        async (err, cha) => {
                          if (err) {
                            console.log(err);
                          } else {
                            // find producer and push product id
                            await Producer.findByIdAndUpdate(
                              req.body.id_producer,
                              {
                                $addToSet: {
                                  listIdProduct: product._id,
                                },
                              },
                              (err, cha) => {
                                if (err) {
                                  console.log(err);
                                } else {
                                  res.redirect("/product/show-product?page=1");
                                }
                              }
                            ).clone();
                          }
                        }
                      ).clone();
                    }
                  }
                ).clone();
              }
            }
          ).clone();
        }
      ).clone();
    }
  },

  getDeleteProduct: async function (req, res) {
    if (req.user) {
      Product.findByIdAndDelete(req.params.id, async (err, product) => {
        if (product.listImgExtra.length > 0) {
          for (let img of product.listImgExtra) {
            await uploadImg.deleteFile(req, res, img);
          }
        }
        if (err) return next(err);
        // find category and remove product id
        const currentCategory = await Category.find({
          listIdProduct: req.params.id,
        }).clone();
        // find category and remove product id
        await Category.findByIdAndUpdate(
          currentCategory[0]._id,
          {
            $pull: {
              listIdProduct: req.params.id,
            },
          },
          async (err, cha) => {
            if (err) {
              console.log(err);
            } else {
              // find producer and remove product id
              const currentProducer = await Producer.find({
                listIdProduct: req.params.id,
              }).clone();
              // find producer and remove product id
              await Producer.findByIdAndUpdate(
                currentProducer[0]._id,
                {
                  $pull: {
                    listIdProduct: req.params.id,
                  },
                },
                (err, cha) => {
                  if (err) {
                    console.log(err);
                  } else {
                    res.redirect("/product/show-product?page=1");
                  }
                }
              ).clone();
            }
          }
        ).clone();
      }).clone();
    }
  },
};

module.exports = product;
