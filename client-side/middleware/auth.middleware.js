module.exports = async function(req, res, next){
    if (!req.signedCookies.userID){
        res.locals.checkLogin = false
    }else{
        res.locals.checkLogin = true;
    }

    next();
}

module.exports.redirect = async function(req, res, next){
    if (!req.signedCookies.userID) {
        res.redirect('/authentication')
        return
    } else {
        next();
    }
}