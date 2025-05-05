

export default function auth(req, res, next) {
    if (req.session.auth === false) {
        req.session.retUrl = req.originalUrl;
        res.render('partials/loginRequired',{ showLoginModal: true, retUrl:req.session.retUrl })
        // return res.redirect('/user/login');
    }
    next();
}

