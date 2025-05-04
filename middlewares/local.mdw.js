import serviceRoute from '../routes/service.route.js';
import serviceService from '../services/service.service.js';

export default function (app) {
    app.use(async function (req, res, next) {
        if (!req.session.auth) {
            req.session.auth = false;
        }
        res.locals.auth = req.session.auth;
        res.locals.authUser = req.session.authUser || null;
        next();
    });
    app.use(async (req, res, next) => {
        const dogCategories = await serviceService.findByPetType(1);
        const catCategories = await serviceService.findByPetType(2);
        const generalCategories = await serviceService.findByPetType(3);
        const dogLimitCate = dogCategories.slice(0, 4);
        const catLimitCate = catCategories.slice(0, 4);
        const generalLimitCate = generalCategories.slice(0, 4);

        res.locals.dogCategories = dogCategories;
        res.locals.catCategories = catCategories;
        res.locals.generalCategories = generalCategories;
        res.locals.dogLimitCate = dogLimitCate;
        res.locals.catLimitCate = catLimitCate;
        res.locals.generalLimitCate = generalLimitCate;
        // Tiếp tục xử lý request
        next();
    });

}