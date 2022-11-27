
function getRegister (req, res) {
    res.render("./register/register.hbs", {
        layout: false,
    });
}

module.exports = {
    getRegister
}