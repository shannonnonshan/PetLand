import express from 'express';
import petService from '../services/pet.service.js';
const route = express.Router();

route.get('/managePet/all', async function(req, res){
    if (req.session.authUser){
    const list = await petService.findAll().lean();
    res.render('vwOwner/approved', {
        layout: 'owner-layout',
        list: list
    })
    }
    else{
        res.render('partials/loginRequired',{ showLoginModal: true })
    }  
})
route.get('/managePet/pending', async function(req, res){
    if (req.session.authUser){

    const list = await petService.findAllBy("pending").lean();
    res.render('vwOwner/pending', {
        layout: 'owner-layout',
        list: list
    })
    }
    else{
        res.render('partials/loginRequired',{ showLoginModal: true })
    } 
})
route.get('/managePet/approved', async function(req, res){
    if (req.session.authUser){

    const list = await petService.findAllBy("approved").lean();
    res.render('vwOwner/approved', {
        layout: 'owner-layout',
        list: list
    })
    }else{
        res.render('partials/loginRequired',{ showLoginModal: true })
    }  
})
route.get('/managePet/adopt_requested', async function(req, res){
    if (req.session.authUser){

    const list = await petService.findAllBy("adopt_requested").lean();
    res.render('vwOwner/pending-adopt', {
        layout: 'owner-layout',
        list: list
    })}else{
        res.render('partials/loginRequired',{ showLoginModal: true })
    }  
})
route.get('/managePet/adopt_approved', async function(req, res){
    if (req.session.authUser){

    const list = await petService.findAllBy("adopt_approved").lean();
    res.render('vwOwner/approved', {
        layout: 'owner-layout',
        list: list
    })}
    else{
        res.render('partials/loginRequired',{ showLoginModal: true })
    }  
})
route.get('/managePet/rejected', async function(req, res){
    if (req.session.authUser){

    const list = await petService.findAllBy("rejected").lean();
    res.render('vwOwner/approved', {
        layout: 'owner-layout',
        list: list
    })
    }else{
        res.render('partials/loginRequired',{ showLoginModal: true })
    }  
})
route.get('/managePet/adopt_completed', async function(req, res){
    if (req.session.authUser){

    const list = await petService.findAllBy("adopt_completed").lean();
    res.render('vwOwner/approved', {
        layout: 'owner-layout',
        list: list
    })
    }else{
        res.render('partials/loginRequired',{ showLoginModal: true })
    }  
})

route.get('/home', function(req, res){
    if (req.session.authUser){

    res.render('vwOwner/home', {
        layout: 'owner-layout',
    })
    }else{
            res.render('partials/loginRequired',{ showLoginModal: true })
        }  
})
route.get('/manageService/shift', function(req, res){
    if (req.session.authUser){

    res.render('vwOwner/service/shift', {
        layout: 'owner-layout',
    })
    }else{
            res.render('partials/loginRequired',{ showLoginModal: true })
        }  
})

route.get('/manageService/booking', function(req, res){
    if (req.session.authUser){

    res.render('vwOwner/service/booking', {
        layout: 'owner-layout',
    })
    }else{
            res.render('partials/loginRequired',{ showLoginModal: true })
        }  
})

route.get('/manageService/bill', function(req, res){
    if (req.session.authUser){

    res.render('vwOwner/service/bill', {
        layout: 'owner-layout',
    })
    }else{
            res.render('partials/loginRequired',{ showLoginModal: true })
        }  
})


export default route;