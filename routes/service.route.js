import express from 'express';
import bcrypt from 'bcryptjs'; 
import dotenv from 'dotenv';
import auth from '../middlewares/auth.mdw.js';
import userService from '../services/user.service.js';
import nodemailer from 'nodemailer';
import moment from 'moment';
import serviceService from '../services/service.service.js';
import bookingService from '../services/booking.service.js';
import { Booking } from '../models/Booking.js';
import shiftService from '../services/shift.service.js';
import ServiceContext from '../state/serviceState/serviceContext.js';

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
route.get('/booking', auth, async function(req,res){
    if (req.session.authUser) {
    const id = req.session.authUser.id;
    let booking = await bookingService.findBookedServiceByCustomerId(id)
    let bookingPending = await bookingService.findPendingBookedService(id)
    let bookingCompleted = await bookingService.findCompletedBookedService(id)
    let bookingConfirmed = await bookingService.findScheduledBookedService(id)
    let bookingPaid = await bookingService.findPaidBookedService(id)
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
    const customerId = req.session.authUser.id;
    const entity = {
        service: bookedServiceIds,
        status: 'pending',
        customer: customerId
    }
    await bookingService.insertBookedService(entity);
    const bookedServiceFinal = await bookingService.findBookedService(customerId, bookedServiceIds, 'pending');
    let booking = await bookingService.findExistBooking(customerId)
    try {
        if (booking && booking._id) {
            await bookingService.saveNewBookedService(booking, bookedServiceFinal._id);
        } else {
        booking = new Booking({
            customer: customerId,
            bookedServices: [bookedServiceFinal._id],
            createAt: null, // có thể gán sau
            paymentStatus: 'PENDING'
        });
        await bookingService.save(booking);
        }
        res.render('partials/bookingSuccess',{ showSuccessModal: true })
        } catch (error) {
          console.error(error);
          await bookingService.deleteBookedServiceById(bookedServiceFinal._id);
          res.status(500).send('Error creating or updating booking');
        }
    }
});
route.post('/cancel-booking',async function(req,res){
    if (req.session.authUser) {
    const { bookedServiceIds } = req.body;
    const customerId = req.session.authUser.id;
    try {
        let booking = await bookingService.findExistBooking(customerId)
        const shiftAdded = await shiftService.findShiftByBookedService(bookedServiceIds)
        if(shiftAdded)
        {
            await shiftService.deleteShiftById(shiftAdded._id);
        }
        await bookingService.updateAfterDeleteBookedService(booking._id,bookedServiceIds)
        const reloadedBooking = await bookingService.findBookingById(booking._id)
        await bookingService.deleteBookedService(bookedServiceIds);
        console.log(reloadedBooking)
        if (!reloadedBooking.bookedServices || reloadedBooking.bookedServices.length === 0) {
            await bookingService.deleteBookingById(reloadedBooking._id);
        }
        res.redirect(req.get('referer'));
        } catch (error) {
        console.error(error);
        res.status(500).send('Error updating booking');
        }
    }
        
    else{
        res.render('partials/loginRequired',{ showLoginModal: true })
    }
});
route.get('/schedule', async function(req,res)
{
    const id = String(req.query.id) || 0;
    const bookedService = await bookingService.findBookedServiceUserServiceByBookedId(id)
    if (req.session.authUser){
        res.render('vwBooking/schedule',{
            bookedService: bookedService,
            id:id,
            user: bookedService.customer,
            service: bookedService.service,
        })
    }
    else{
        res.render('partials/loginRequired',{ showLoginModal: true })
    }
    
}),

route.get('/is-available', async function (req, res) {
    const start= Date.parse(req.query.start);
    const end = Date.parse(req.query.end);
    const startTime = new Date(start)
    const endTime = new Date(end)
    const isAvailable = true
    try {
        const overlappingShifts = await shiftService.findCollapseShift(startTime, endTime)
        if (overlappingShifts.length >= 5) {
            isAvailable = false
        }
        const existingShifts = await shiftService.findSameShift(startTime, endTime)
        if (existingShifts.length >= 5) {
            isAvailable = false
        }
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

route.post('/schedule', async function(req,res)
{
    if (req.session.authUser){
        const customer = await userService.findById(req.session.authUser.id)
        const name = req.body.name
        const phone = req.body.phone
        const email = req.body.email
        const bookedServiceId = req.body.bookedServiceId
        const updateBookedService = await bookingService.findBookedServiceById(bookedServiceId)
        if(updateBookedService){
            await userService.updateUserforShift(customer._id, name, phone, email)
            const startTime = moment(req.body.startTime, "DD/MM/YYYY HH:mm").toDate()
            const endTime = moment(req.body.endTime, "DD/MM/YYYY HH:mm").toDate()
            const formattedDate = moment(req.body.startTime, "DD/MM/YYYY HH:mm").startOf('day').toDate();
            const entity = {
                    bookedService: bookedServiceId,
                    startTime: startTime,
                    endTime: endTime,
                }
            await shiftService.add(entity);
            const shiftAdded = await shiftService.findShiftByBookedService(bookedServiceId)
            try{
                    const bookedStatus = await bookingService.findBookedById(bookedServiceId)
                    const statusContext = new ServiceContext(bookedStatus);
                    statusContext.confirm(shiftAdded._id);
                    await statusContext.save();  
                    await bookingService.findBookedAndDeleteAfterSchedule(bookedServiceId)
                    
                }
                catch(error)
                {
                    console.error(error); // in ra lỗi để debug
                    const shiftAdded = await shiftService.findShiftByBookedService(bookedServiceId);
                    if (shiftAdded) {
                      await shiftService.deleteShiftById(shiftAdded._id);
                    }
                    return res.status(500).send("error, try again");
                }
                let booking = await bookingService.findExistBookingByTime(formattedDate)
                if (booking && booking._id) {
                    await bookingService.saveNewBookedService(booking, bookedServiceId);
                } else {
                booking = new Booking({
                    customer: customer._id,
                    bookedServices: [bookedServiceId],
                    accountant: null, 
                    paymentStatus: 'PENDING',
                    createAt:formattedDate,
                });
                await bookingService.save(booking);
                }
                const url = req.session.retUrl || '/';
                res.redirect(url);
        }else{
            console.error(error);
            const shiftAdded= await shiftService.findShiftByBookedService(bookedServiceId)
            await shiftService.deleteShiftById(shiftAdded._id);
            res.status(500).send('Error updating booking');
        }
    }
    else{
        res.render('partials/loginRequired',{ showLoginModal: true })
    }   
})

export default route;