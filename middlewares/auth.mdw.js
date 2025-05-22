// middlewares/auth.js
import { BasicAuthStrategy } from '../strategies/basicAuthStrategy.js';
import { OwnerAuthStrategy } from '../strategies/ownerAuthStrategy.js';
import { StaffAuthStrategy } from '../strategies/staffAuthStrategy.js';

function useAuthStrategy(StrategyClass) {
  return (req, res, next) => {
    const strategy = new StrategyClass();
    strategy.handle(req, res, next);
  };
}

const auth = useAuthStrategy(BasicAuthStrategy);
const authOwner = useAuthStrategy(OwnerAuthStrategy);
const authStaff = useAuthStrategy(StaffAuthStrategy);

export { auth, authOwner, authStaff };
