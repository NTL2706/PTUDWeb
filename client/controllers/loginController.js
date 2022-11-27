
function getLogin(req, res) {
    res.render("login/login", {
        layout: false,
    });
}

module.exports = {
    getLogin
}
