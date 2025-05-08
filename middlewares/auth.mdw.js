

export default function auth(req, res, next) {
    console.log(req.originalUrl);
    if (!req.session.auth || !req.session.authUser) {
        req.session.retUrl = req.originalUrl || null;
        console.log(req.originalUrl);
        console.log(req.session.retUrl);
        return res.redirect('/user/popupLogin');
    }
    next();
}

