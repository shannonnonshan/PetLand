export default function requireRole(role) {
    return (req, res, next) => {
        if (!req.session.auth || req.session.authUser.role !== role) {
            return res.status(403).send('Access Denied');
        }
        next();
    };
}
