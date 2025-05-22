// strategies/authStrategy.js
export class AuthStrategy {
  handle(req, res, next) {
    throw new Error("Not implemented");
  }

  _checkLoggedIn(req, res) {
    if (!req.session.auth || !req.session.authUser) {
      req.session.retUrl = req.originalUrl || null;
      req.session.message = "Please log in first.";
      res.redirect('/user/popupLogin');
      return false;
    }
    return true;
  }
}
