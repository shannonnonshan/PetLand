
import serviceService from '../services/service.service.js';
import notificationService from '../services/notification.service.js';

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
        
        const dogLimitCate = dogCategories.slice(0, 5);
        const catLimitCate = catCategories.slice(0, 5);
        const generalLimitCate = generalCategories.slice(0, 5);
        
        res.locals.dogCategories = dogCategories;
        res.locals.catCategories = catCategories;
        res.locals.generalCategories = generalCategories;
        res.locals.dogLimitCate = dogLimitCate;
        res.locals.catLimitCate = catLimitCate;
        res.locals.generalLimitCate = generalLimitCate;
        if (res.locals.authUser) {
            const notification = await notificationService.findNotificationByUserId(res.locals.authUser._id);
            res.locals.notification = notification;
        }
        next();
    });

}