import express from 'express';
import bcrypt from 'bcryptjs'; 
import dotenv from 'dotenv';
import auth from '../middlewares/auth.mdw.js';
import userService from '../services/user.service.js';
import configurePassportGoogle from '../controllers/passportGoogle.config.js';
import passport from 'passport';
const route = express.Router();
dotenv.config();

route.get('/login', function (req, res) {
    res.render('vwUser/login', {
        layout: 'account-layout'
    });
    
});

route.post('/login', async function (req, res) {
    const user = await userService.findByUsername(req.body.username);
    if (!user) {
        return res.render('vwUser/login', {
            layout: 'account-layout',
            showErrors: true
        });
    }
    if (!bcrypt.compareSync(req.body.raw_password, user.password)) {
        return res.render('vwUser/login', {
            layout: 'account-layout',
            showErrors: true,
        });
    }
    req.session.auth = true;


    req.session.authUser = {
        username: user.username,
        userid: user.id,
        email: user.email,
    };

    const retUrl = req.session.retUrl || '/';
    res.redirect(retUrl);
});


route.get('/register', function (req, res) {
    res.render('vwUser/register', {
        layout: 'account-layout'
    });
});

route.post('/register', async function (req, res) {
    const hash_password = bcrypt.hashSync(req.body.raw_password, 8);
    console.log(req.body.raw_dob);
    const entity = {
        id: req.body.idnumber,
        username: req.body.username,
        password: hash_password,
        email: req.body.email,
        createAt: Date.now()
    }
    const ret = await userService.add(entity);
    const retUrl = '/user/login'
    res.redirect(retUrl);
});

route.get('/is-available', async function (req, res) {
    const username = req.query.username;
    const user = await userService.findByUsername(username);
    if (!user) {
        return res.json(true);
    }
    res.json(false);
});

route.post('/logout', auth, function (req, res) {
    req.session.auth = false;
    req.session.authUser = null;
    res.redirect('/');
});

configurePassportGoogle();
route.get('/login/googleAuth',
  passport.authenticate('google'));

route.get('/login/googleAuth/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async function (req, res) {
    const user = req.user; 
    if (!user) {
      return res.redirect('/login');
     }
    req.session.auth = true;
    req.session.authUser = {
        username: user.username,
        userid: user.id,
        email: user.email,
    };
    res.redirect('/');
    })
  
export default route;