
import userRoute from '../routes/user.route.js';
import serviceRoute from '../routes/service.route.js';
import petRoute from '../routes/pet.route.js';
import ownerRoute from '../routes/owner.route.js';
import staffRoute from'../routes/staff.route.js';
import customerRoute from '../routes/customer.route.js';

export default function (app) {
    
    app.get('/', function (req, res) {
     if (!req.session.auth || !req.session.authUser) {
        return res.render('homepage',{isHome:true});
      }
      
    return res.render('homepage', {
        authUser: req.session.authUser,
        isHome:true
    });

  });

    app.use('/user', userRoute);
    app.use('/service', serviceRoute);
    app.use('/pet', petRoute);
    app.use('/owner', ownerRoute);
    app.use('/staff', staffRoute);
    app.use('/customer',customerRoute)
}

