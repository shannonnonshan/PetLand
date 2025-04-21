
export default function (app) {
    app.use(async function (req, res, next) {
        if (!req.session.auth) {
            req.session.auth = false;
        }
        res.locals.auth = req.session.auth;
        res.locals.authUser = req.session.authUser || null;
        next();
    });
}