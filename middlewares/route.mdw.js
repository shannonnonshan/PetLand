
import userRoute from '../routes/user.route.js';
import serviceRoute from '../routes/service.route.js';
import petRoute from '../routes/pet.route.js';

export default function (app) {
    
    app.get('/', function (req, res) {
        if (!req.session.auth || !req.session.authUser) {
             return res.render('homepage', {layout: 'account-layout'});
         }
         
         if (req.session.views) {
             req.session.views++;
         } else req.session.views = 1;
         res.render('homepage', {layout:'account-layout'});
     });
   

    app.use('/user', userRoute);
    app.use('/service', serviceRoute);
    app.use('/pet', petRoute);
}

