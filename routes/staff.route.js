import express from 'express';
import petService from '../services/pet.service.js';
import userService from '../services/user.service.js';
import shiftService from '../services/shift.service.js';
import bcrypt from 'bcryptjs'; 
import dotenv from 'dotenv';
import {auth} from '../middlewares/auth.mdw.js';
import nodemailer from 'nodemailer';
import moment from 'moment';
import bookingService from '../services/booking.service.js';
import ServiceContext from '../state/serviceState/serviceContext.js';
import BookingContext from '../state/serviceState/bookingContext.js';
import {notifyEmailLater} from '../controllers/service.controller.js';
import serviceService from '../services/service.service.js';
import { paginateQuery } from '../utils/pagination.js';
const route = express.Router();

route.get('/manageService/all',auth, async function(req, res){
    if (req.session && req.session.authUser) {
        const id = req.session.authUser.id
        const pageAll = parseInt(req.query.pageAll) || 1;
        const pageMySchedule = parseInt(req.query.pageMySchedule) || 1;
        const pageCheckOut = parseInt(req.query.pageCheckOut) || 1;
        const pagePaid = parseInt(req.query.pagePaid) || 1;
        const limit=5;
        const booking = await bookingService.findShiftedOwner()
        const bookingMySchedule = await bookingService.findBookedByStaff(id)
        const bookingCheckOut = await bookingService.findBookedByStatus()
        const bookingPaid = await bookingService.findAllPaid()

        const paginatedBooking = await paginateQuery(booking, pageAll, limit);
        const paginatedMySchedule = await paginateQuery(bookingMySchedule, pageMySchedule, limit);
        const paginatedCheckOut = await paginateQuery(bookingCheckOut,pageCheckOut, limit);
        const paginatedPaid = await paginateQuery(bookingPaid, pagePaid, limit);

        res.render('vwStaff/service', {
            layout: 'staff-layout',
            booking: paginatedBooking.data,
            bookingMySchedule:  paginatedMySchedule.data,
            bookingCheckOut: paginatedCheckOut.data,
            bookingPaid: paginatedPaid.data,
            bookingPagination: paginatedBooking,
            bookingMySchedulePagination: paginatedMySchedule,
            bookingCheckOutPagination: paginatedCheckOut,
            bookingPaidPagination: paginatedPaid,
        })
    }else{
        res.render('partials/loginRequired',{ showLoginModal: true })
    } 
})
route.post('/manageService/complete',auth,async function(req,res){
    const { bookedServiceIds } = req.body;
    try {
        const bookedStatus = await bookingService.findBookedById(bookedServiceIds)
        const statusContext = new ServiceContext(bookedStatus);
        statusContext.complete();
        await statusContext.save(); 
        res.redirect(req.get('referer'));
        } catch (error) {
        console.error(error);
        res.status(500).send('Error updating booking');
        }
});
route.post('/manageService/checkout',auth,async function(req,res){
    const {bookingId } = req.body;
    try {
        const bookingStatus = await bookingService.findBookingByIdStatus(bookingId)
        const statusContext = new BookingContext(bookingStatus);
        statusContext.paid(req.session.authUser.id);
        await statusContext.save(); 
        await notifyEmailLater(bookingStatus.customer._id,"confirmPaid",bookingStatus)
        res.redirect(req.get('referer'));
        } catch (error) {
        console.error(error);
        res.status(500).send('Error updating booking');
        }
});
route.post('/manageService/response-review',auth,async function(req,res){
    const {reviewId,response } = req.body;
    try {
        const ret = await serviceService.updateReviewResponse(reviewId,response)
        res.redirect(req.get('referer'));
        } catch (error) {
        console.error(error);
        res.status(500).send('Error updating booking');
        }
});
route.post('/manageService/hide-review',auth,async function(req,res){
    const reviewId = req.query.id;
    console.log(reviewId)
    try {
        const ret = await serviceService.updateReviewStatus(reviewId,false)
        res.redirect(req.get('referer'));
        } catch (error) {
        console.error(error);
        res.status(500).send('Error updating booking');
        }
});
route.post('/manageService/unhide-review',auth,async function(req,res){
    const reviewId = req.query.id;
    console.log(reviewId)
    try {
        const ret = await serviceService.updateReviewStatus(reviewId,true)
        res.redirect(req.get('referer'));
        } catch (error) {
        console.error(error);
        res.status(500).send('Error updating booking');
        }
});
export default route;