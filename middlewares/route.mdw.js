
import userRoute from '../routes/user.route.js';
import serviceRoute from '../routes/service.route.js';
export default function (app) {
    
    app.get('/', function (req, res) {
     if (!req.session.auth || !req.session.authUser) {
        return res.render('homepage', {
            layout: false,
            authUser: req.session.authUser,
        });
      }
      
    //   if (req.session.views) {
    //       req.session.views++;
    //   } else req.session.views = 1;
    //   return res.render('homepage', { layout: false });

  });

    app.use('/user', userRoute);
    app.use('/service', serviceRoute);
}

