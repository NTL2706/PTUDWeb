

module.exports = {
    getMyAccount: (req, res) => {
        res.render("my-account/my-account.hbs", {

        });
    },

    getEditMyAccount: (req, res) => {
        res.render("my-account/edit-account.hbs", {
            layout: false,
        });
    },

    getChangePassWordMyAccount: (req, res) => {
        res.render("my-account/change-password.hbs", {
            layout: false,
        });
    },
}