

export default function auth(req, res, next) {
    if (!req.session.auth || !req.session.authUser) {
        req.session.retUrl = req.originalUrl || null;
        return res.redirect('/user/popupLogin');
    }
    next();
}

