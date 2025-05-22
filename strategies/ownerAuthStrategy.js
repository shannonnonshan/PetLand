// strategies/ownerAuthStrategy.js
import { AuthStrategy } from './authStrategy.js';

export class OwnerAuthStrategy extends AuthStrategy {
  handle(req, res, next) {
    if (!this._checkLoggedIn(req, res)) return;

    if (req.session.authUser.role !== "Owner") {
      req.session.retUrl = null;
      req.session.message = "You do not have permission to access this page. Please log in with an owner account.";
      return res.redirect('/user/popupLogin');
    }

    req.session.retUrl = req.originalUrl;
    next();
  }
}
