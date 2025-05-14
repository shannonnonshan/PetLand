function auth(req, res, next) {
    if (!req.session.auth || !req.session.authUser) {
        req.session.retUrl = req.originalUrl || null;
        req.session.message = "Please log in first.";
        return res.redirect('/user/popupLogin');
    }
    next();
}

function authOwner(req, res, next) {
    if (!req.session.auth || !req.session.authUser) {
        req.session.retUrl = req.originalUrl || null;
        req.session.message = "Please log in first.";
        return res.redirect('/user/popupLogin');
    }

    if (req.session.authUser.role !== "Owner") {
        req.session.retUrl = null;
        req.session.message = "You do not have permission to access this page. Please log in with an owner account.";
        return res.redirect('/user/popupLogin');
    }
    else {
        req.session.retUrl = req.originalUrl;
    }

    next();
}

export { auth, authOwner };
