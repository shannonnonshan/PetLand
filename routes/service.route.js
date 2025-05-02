import express from 'express';
import bcrypt from 'bcryptjs'; 
import dotenv from 'dotenv';
import auth from '../middlewares/auth.mdw.js';
import userService from '../services/user.service.js';
import nodemailer from 'nodemailer';
import serviceService from '../services/service.service.js';
import bookingService from '../services/booking.service.js';
import { Booking } from '../models/Booking.js';

const route = express.Router();
dotenv.config();

route.get('/detail', async function(req,res){
    const id = String(req.query.id) || 0;
    let service = await serviceService.findByServiceId(id)
    let listService = await serviceService.findByPetType(service.petType)
    res.render('vwService/detail',{
        service:service,
        list: listService,
        authUser: req.session.authUser
    })
})
route.get('/booking', async function(req,res){
    if (req.session.authUser) {
    const id = req.session.authUser.userid;
    let booking = await bookingService.findBookedServiceById(id)
    let bookingPending = await bookingService.findPendingBookedService(id)
    let bookingCompleted = await bookingService.findCompletedBookedService(id)
    let bookingConfirmed = await bookingService.findScheduledBookedService(id)
    let bookingPaid = await bookingService.findPaidBookedService(id)
    console.log(booking)
    res.render('vwBooking/bookingOfCustomer',{
        booking:booking,
        bookingPending: bookingPending,
        bookingCompleted: bookingCompleted,
        bookingConfirmed: bookingConfirmed,
        bookingPaid: bookingPaid
    })
    }
    else{
        res.render('partials/loginRequired',{ showLoginModal: true })
    }
})
route.post('/create-booking',async function(req,res){
    if (req.session.authUser) {
    const { bookedServiceIds } = req.body;
    const customerId = req.session.authUser.userid;
    try {
        let booking = await bookingService.findExistBooking(customerId)
        console.log(booking)
        const entity = {
                service: bookedServiceIds,
                status: 'pending',
                customer: customerId
            }
        await bookingService.insertBookedService(entity);
        const bookedServiceFinal = await bookingService.findBookedService(customerId, bookedServiceIds, 'pending');
        if (booking  && booking._id) {
            console.log(bookedServiceFinal._id)
            await bookingService.saveNewBookedService(booking, bookedServiceFinal._id);
        } else {
        booking = new Booking({
            customer: customerId,
            bookedServices: bookedServiceFinal._id,
            accountant: null, // có thể gán sau
            paymentStatus: 'PENDING'
        });
        await bookingService.save(booking);
        }
      
          res.redirect('back');
        } catch (error) {
            try {
               await bookingService.deleteBookedServiceById(bookedServiceFinal._id);
                
              } catch (cleanupError) {
                console.error('Error during cleanup:', cleanupError);
              }
          console.error(error);
          res.status(500).send('Error creating or updating booking');
        }
    }
});

export default route;