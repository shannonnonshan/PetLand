import express from 'express';
import petService from '../services/pet.service.js';
const route = express.Router();

route.get('/managePet/all', async function(req, res){
    const list = await petService.findAll().lean();
    res.render('vwOwner/approved', {
        layout: 'owner-layout',
        list: list
    })
})
route.get('/managePet/pending', async function(req, res){
    const list = await petService.findAllBy("pending").lean();
    res.render('vwOwner/pending', {
        layout: 'owner-layout',
        list: list
    })
})
route.get('/managePet/approved', async function(req, res){
    const list = await petService.findAllBy("approved").lean();
    res.render('vwOwner/approved', {
        layout: 'owner-layout',
        list: list
    })
})
route.get('/managePet/adopt_requested', async function(req, res){
    const list = await petService.findAllBy("adopt_requested").lean();
    res.render('vwOwner/pending-adopt', {
        layout: 'owner-layout',
        list: list
    })
})
route.get('/managePet/adopt_approved', async function(req, res){
    const list = await petService.findAllBy("adopt_approved").lean();
    res.render('vwOwner/completed-adopt', {
        layout: 'owner-layout',
        list: list
    })
})
route.get('/managePet/rejected', async function(req, res){
    const list = await petService.findAllBy("rejected").lean();
    res.render('vwOwner/approved', {
        layout: 'owner-layout',
        list: list
    })
})
route.get('/managePet/adopt_completed', async function(req, res){
    const list = await petService.findAllBy("adopt_completed").lean();
    res.render('vwOwner/approved', {
        layout: 'owner-layout',
        list: list
    })
})

route.get('/home', function(req, res){
    res.render('vwOwner/home', {
        layout: 'owner-layout',
    })
})


export default route;