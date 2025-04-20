
import userRoute from '../routes/user.route.js';


export default function (app) {
    
    app.get('/', async function (req, res) {
        if (!req.session.auth || !req.session.authUser) {
            return res.render('homepage');
        }
    });

    app.use('/user', userRoute);

}

