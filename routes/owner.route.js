import express from 'express';
import petService from '../services/pet.service.js';
import userService from '../services/user.service.js';
import shiftService from '../services/shift.service.js';
import bcrypt from 'bcryptjs'; 
import dotenv from 'dotenv';
import auth from '../middlewares/auth.mdw.js';
import nodemailer from 'nodemailer';
import moment from 'moment';
import bookingService from '../services/booking.service.js';
import ServiceContext from '../state/serviceState/serviceContext.js';
import {notifyEmailLater} from '../controllers/service.controller.js';

const route = express.Router();

route.get('/managePet/all',auth, async function(req, res){
    
    const list = await petService.findAll().lean();
    res.render('vwOwner/pet/approved', {
        layout: 'owner-layout',
        list: list
    })
    
})
route.get('/managePet/pending',auth, async function(req, res){
    

    const list = await petService.findAllBy("pending").lean();
    res.render('vwOwner/pet/pending', {
        layout: 'owner-layout',
        list: list
    })
   
})
route.get('/managePet/approved',auth, async function(req, res){
    

    const list = await petService.findAllBy("approved").lean();
    res.render('vwOwner/pet/approved', {
        layout: 'owner-layout',
        list: list
    })
     
})
route.get('/managePet/adopt_requested',auth, async function(req, res){
    

    const list = await petService.findAllBy("adopt_requested").lean();
    res.render('vwOwner/pet/pending-adopt', {
        layout: 'owner-layout',
        list: list
    })
})
route.get('/managePet/adopt_approved',auth, async function(req, res){
    

    const list = await petService.findAllBy("adopt_approved").lean();
    res.render('vwOwner/pet/completed-adopt', {
        layout: 'owner-layout',
        list: list
    })
})
route.get('/managePet/rejected',auth, async function(req, res){
    

    const list = await petService.findAllBy("rejected").lean();
    res.render('vwOwner/pet/approved', {
        layout: 'owner-layout',
        list: list
    })
     
})
route.get('/managePet/adopt_completed',auth, async function(req, res){
    

    const list = await petService.findAllBy("adopt_completed").lean();
    res.render('vwOwner/pet/approved', {
        layout: 'owner-layout',
        list: list
    })
     
})

route.get('/home', function(req, res){
    

    res.render('vwOwner/home', {
        layout: 'owner-layout',
    })
     
})
route.get('/manageService/shift',auth, async function(req, res){
    const booking = await bookingService.findShiftedOwner()
    res.render('vwOwner/service/shift', {
        layout: 'owner-layout',
        booking:booking
    })
})

route.get('/manageService/booking', auth, async function(req, res){
    const booking = await bookingService.findBookingOwner()
    const bookingRejected = await bookingService.findRejectedOwner()
    const bookingWaitShifting = await bookingService.findWaitShiftingOwner()
    const bookingCompleted = await bookingService.findCompletedBookedService()
    const bookingPaid = await bookingService.findAllPaid()
    res.render('vwOwner/service/booking', {
        layout: 'owner-layout',
        booking: booking,
        bookingRejected: bookingRejected,
        bookingWaitShifting: bookingWaitShifting,
        bookingCompleted:bookingCompleted,
        bookingPaid: bookingPaid
    })
    
})
route.post('/manageService/reject-booking',auth,async function(req,res){
    const { bookedServiceIds } = req.body;
    try {
        const shiftAdded = await shiftService.findShiftByBookedService(bookedServiceIds)
        if(shiftAdded)
        {
            await shiftService.deleteShiftById(shiftAdded._id);
        }
        const bookedStatus = await bookingService.findBookedById(bookedServiceIds)
        const statusContext = new ServiceContext(bookedStatus);
        statusContext.cancel();
        await statusContext.save(); 
        await notifyEmailLater(bookedStatus.customer._id,"rejectService",bookedStatus)
        res.redirect(req.get('referer'));
        } catch (error) {
        console.error(error);
        res.status(500).send('Error updating booking');
        }
});

route.get('/manageService/shift-staff', auth, async function(req,res)
{
    const id = req.query.id || 0;
    const bookedService = await bookingService.findOneWaitShiftingOwner(id)
    try{
        const shift = bookedService.shift
        const startTime = shift.startTime
        const endTime = shift.endTime
        if(shift){
            const staff = await userService.findStaffAvailableDuring(startTime, endTime)
            res.render('vwOwner/service/shiftStaff',{
                layout: 'owner-layout',
                bookedService: bookedService,
                id:id,
                service: bookedService.service,
                shift: shift,
                staff:staff
        })}
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Error creating or updating booking');
    }
}),

route.get('/is-available', async function (req, res) {
    const isAvailable = true
    try {
        
        if (isAvailable) {
            return res.json(true); // Slot is available
        } else {
            return res.json(false); // Slot is not available
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating or updating booking');
    }
});

route.post('/manageService/shift-staff',  auth, async function(req,res)
{
        const inCharge = req.body.inCharge
        const bookedServiceId = req.body.bookedServiceId
        const updateBookedService = await bookingService.findBookedServiceById(bookedServiceId)
        if(updateBookedService){
            await bookingService.updateInCharge(bookedServiceId, inCharge)
            const url= '/owner/manageService/shift';
            res.redirect(url);
        }else{
            console.error(error);
            res.status(500).send('Error updating booking');
        }
      
})

export default route;