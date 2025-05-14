import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import activate_locals_middleware from './middlewares/local.mdw.js';
import activate_view_middleware from './middlewares/view.mdw.js';
import activate_route_middleware from './middlewares/route.mdw.js';
import activate_session_middleware from './middlewares/session.mdw.js';
import passport from 'passport';
import handlebars from 'handlebars';

const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url)); 
app.use(express.urlencoded({
    extended: true
}));
app.use('/uploads', express.static('public/uploads'));


app.use('/static', express.static('static'));
app.use('/css', express.static(path.join(__dirname, 'static', 'css')));
app.use('/imgs', express.static(path.join(__dirname, 'static', 'imgs')));



app.use(express.json()); 


activate_session_middleware(app);
app.use(passport.initialize());
app.use(passport.session());
activate_locals_middleware(app);
activate_view_middleware(app);
activate_route_middleware(app);
app.listen(3000, function () {
    console.log('App is running at http://localhost:3000');
});
