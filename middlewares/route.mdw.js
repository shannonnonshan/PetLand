
import userRoute from '../routes/user.route.js';
import serviceRoute from '../routes/service.route.js';
export default function (app) {
    
    app.get('/', function (req, res) {
     if (!req.session.auth || !req.session.authUser) {
        return res.render('homepage',);
      }
      
    return res.render('homepage', {
        authUser: req.session.authUser
    });

  });

    app.use('/user', userRoute);
    app.use('/service', serviceRoute);
}

