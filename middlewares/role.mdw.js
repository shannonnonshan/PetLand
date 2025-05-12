export default function requireRole(role) {
    return (req, res, next) => {
        if (!req.session.auth || req.session.authUser.role !== role) {
            return res.render('partials/loginRequired',{ showLoginModal: true })
        }
        next();
    };
}
