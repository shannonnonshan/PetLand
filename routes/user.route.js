import express from 'express';
import bcrypt from 'bcryptjs';
import moment from 'moment'; 
import dotenv from 'dotenv';
import auth from '../middlewares/auth.mdw.js';
import userService from '../services/user.service.js';

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
        name: user.name,
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
    const ymd_dob = moment(req.body.raw_dob, 'DD-MM-YYYY').format('YYYY-MM-DD');
    const entity = {
        username: req.body.username,
        password: hash_password,
        name: req.body.name,
        email: req.body.email,
        dob: ymd_dob,
        permission: 1
    }
    const ret = await userService.add(entity);
    const user = await userService.findByUsername(req.body.username);
    req.session.auth = true;
    req.session.authUser = {
        username: user.username,
        userid: user.id,
        name: user.name,
        email: user.email,
        permission: user.permission,
        rolename: 'guest'
    }
    const retUrl = req.session.retUrl || '/'
    res.redirect(retUrl);
});

route.get('/is-available', async function (req, res) {
    const username = req.query.username;
    const user = await userService.findByUsername(username);
    if (!user) {
        return res.json(true); //lay bien du lieu quang xuong
    }
    res.json(false);
});

route.post('/logout', auth, function (req, res) {
    req.session.auth = false;
    req.session.authUser = null;
    res.redirect('/');
});

export default route;