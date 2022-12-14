const home = {
    index: function(req,res){
        if(req.user){
            res.render("home.hbs",{});
        }
        else{
            res.redirect("/admin/login");
        }
    }
}

module.exports = home;