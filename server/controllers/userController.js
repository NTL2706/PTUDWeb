const User = require("../models/user.model");

function getAllUser(req, res) {
    if (!req.user) {
        return res.redirect("/admin/login");
    }

    let perPage = 6;
    let page = req.query.page || 1;
    if (page < 1) {
        page = 1;
    }

    User.find() // find all user
        .skip(perPage * page - perPage) // tim 6 user tuong ung vs moi page
        .limit(perPage)
        .exec((err, account) => {
            User.countDocuments((err, count) => {
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
                res.render("account/list-account", {
                    account,
                    pages,
                    isNextPage: page < Math.ceil(count / perPage),
                    isPreviousPage: page > 1,
                    nextPage: +page + 1,
                    previousPage: +page - 1,
                });
            });
        });
}

function getEditAccountUser(req, res, next) {
    if (!req.user) {
        return res.redirect("/admin/login");
    }

    const id = req.params.id;
    console.log("hello");
    User.findById(id, (err, user) => {
        if (err) {
            return next(err);
        }
        res.render("account/edit-account", {
            account: user
        })
    });
}

function postEditAccountUser(req, res, next) {
    const id = req.body.id;
    const newEmail = req.body.email;
    const newName = req.body.name;
    const newAddress = req.body.address

    User.findByIdAndUpdate(id, {
        $set: {
            name: newName,
            email: newEmail,
            address: newAddress
        }
    }, (err, user) => {
        if (err) {
            return next(err);
        }
        res.redirect("/user/all-user?page=1");
    })
}

function getDeleteAccountUser(req, res, next) {
    if (!req.user) {
        return res.redirect("/admin/login");
    }

    const id = req.params.id;

    User.findByIdAndDelete(id, (err, user) => {
        if (err) {
            return next(err);
        }
        res.redirect("/user/all-user?page=1");
    })
}

function getBlockAccountUser(req, res, next) {
    if (!req.user) {
        return res.redirect("/admin/login");
    }

    const id = req.params.id;

    console.log(id);
    User.findByIdAndUpdate(id, {
        $set: {
            status: false
        }
    }, (err, user) => {
        if (err) {
            return next(err);
        }
        res.redirect("/user/all-user?page=1");
    })
}

function getUnBlockAccountUser(req, res, next) {
    if (!req.user) {
        return res.redirect("/admin/login");
    }

    const id = req.params.id;

    User.findByIdAndUpdate(id, {
        $set: {
            status: true
        }
    }, (err, user) => {
        if (err) {
            return next(err);
        }
        res.redirect("/user/all-user?page=1");
    })
}

module.exports = {
    getAllUser,
    getEditAccountUser,
    postEditAccountUser,
    getDeleteAccountUser,
    getBlockAccountUser,
    getUnBlockAccountUser
}