// strategies/staffAuthStrategy.js
import { AuthStrategy } from './authStrategy.js';

export class StaffAuthStrategy extends AuthStrategy {
  handle(req, res, next) {
    if (!this._checkLoggedIn(req, res)) return;

    if (req.session.authUser.role !== "Staff") {
      req.session.retUrl = null;
      req.session.message = "You do not have permission to access this page. Please log in with a staff account.";
      return res.redirect('/user/popupLogin');
    }

    req.session.retUrl = req.originalUrl;
    next();
  }
}
