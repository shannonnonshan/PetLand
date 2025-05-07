

export default function auth(req, res, next) {
    if (!req.session && !req.session.authUser) {
        req.session.retUrl = req.originalUrl;
        res.render('partials/loginRequired',{ showLoginModal: true, retUrl:req.session.retUrl })
        // return res.redirect('/user/login');
    }
    next();
}

