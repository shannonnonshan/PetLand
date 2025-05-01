import express from 'express';
import bcrypt from 'bcryptjs'; 
import dotenv from 'dotenv';
import auth from '../middlewares/auth.mdw.js';
import userService from '../services/user.service.js';
import nodemailer from 'nodemailer';
import serviceService from '../services/service.service.js';

const route = express.Router();
dotenv.config();

route.get('/detail', async function(req,res){
    const id = String(req.query.id) || 0;
    let service = await serviceService.findByServiceId(id)
    let listService = await serviceService.findByPetType(service.petType)
    console.log(service)
    console.log(listService)
    res.render('vwService/detail',{
        service:service,
        list: listService,
        authUser: req.session.authUser
    })
})

export default route;