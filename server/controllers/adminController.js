module.exports = {
    getLogin: (req, res, next) => {
        res.render("admin/login.hbs", {
            layout: false,
        });
    },
    
    getAddAdmin: (req, res, next) => {
        return res.render("admin/add-admin");
    },
    
    // getEditProfile: async (req, res, next) => {
    //     if (!req.user) {
    //         return res.redirect("/admin/login");
    //     }
    //     // find admin by id using await
    //     const admin = await Admin.findById(res.locals.authUser._id);
    //     return res.render("admin/edit-profile", {
    //         id: res.locals.authUser._id,
    //         admin,
    //     });
    // },
    
    getChangePassword: async (req, res, next) => {
       
        return res.render("admin/change-password", {
            // id: res.locals.authUser._id,
        });
    },
    
};
