// strategies/basicAuthStrategy.js
import { AuthStrategy } from './authStrategy.js';

export class BasicAuthStrategy extends AuthStrategy {
  handle(req, res, next) {
    if (!this._checkLoggedIn(req, res)) return;
    next();
  }
}
