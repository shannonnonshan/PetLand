import express from 'express';
import bcrypt from 'bcryptjs'; 
import dotenv from 'dotenv';
import {auth} from '../middlewares/auth.mdw.js';
import userService from '../services/user.service.js';
import moment from 'moment';
import serviceService from '../services/service.service.js';
import bookingService from '../services/booking.service.js';
import { Booking } from '../models/Booking.js';
import shiftService from '../services/shift.service.js';
import ServiceContext from '../state/serviceState/serviceContext.js';
import {notifyEmailLater} from '../controllers/service.controller.js';
import { paginateQuery } from '../utils/features.js';
import notifier from '../observer/notificationObserver.js';
import notificationService from '../services/notification.service.js';
const route = express.Router();
dotenv.config();

route.get('/detail', async function(req,res){
    const id = String(req.query.id) || 0;
    let service = await serviceService.findByServiceId(id)
    let listService = await serviceService.findByPetType(service.petType)
    let review = (service.reviews || []).map(r => ({
        ...r,
        authUser: req.session.authUser
    }));
    res.render('vwService/detail',{
        service:service,
        list: listService,
        authUser: req.session.authUser,
        review:review
    })
})
route.get('/byCat', async function(req, res){
    let list = await serviceService.findAll().lean();

    if (req.query.id) {
        list = list.filter(service  => service.petType === Number(req.query.id));
    } 
    res.render('vwService/byCat', {
        list: list,
    });
})

route.get('/booking', auth, async function(req,res){
    const id = req.session.authUser._id;
    const pageAll = parseInt(req.query.pageAll) || 1;
    const pagePending = parseInt(req.query.pagepending) || 1;
    const pageConfirmed = parseInt(req.query.pageConfirmed) || 1;
    const pagePaid = parseInt(req.query.pagePaid) || 1;
    const pageCompleted = parseInt(req.query.pageCompleted) || 1;
    const limit=5;

    let booking = await bookingService.findBookedServiceByCustomerId(id)
    let bookingPending = await bookingService.findPendingBookedService(id)
    let bookingCompleted = await bookingService.findCompletedBookedService(id)
    let bookingConfirmed = await bookingService.findScheduledBookedService(id)
    let bookingPaid = await bookingService.findPaidBookedService(id)

    const paginatedBooking = await paginateQuery(booking, pageAll, limit);
    const paginatedPending = await paginateQuery(bookingPending, pagePending, limit);
    const paginatedConfirmed = await paginateQuery(bookingConfirmed,pageConfirmed, limit);
    const paginatedCompleted = await paginateQuery(bookingCompleted, pageCompleted, limit);
    const paginatedPaid = await paginateQuery(bookingPaid, pagePaid, limit);
    res.render('vwBooking/bookingOfCustomer',{
        booking: paginatedBooking.data,
        bookingPending:  paginatedPending.data,
        bookingConfirmed: paginatedConfirmed.data,
        bookingCompleted:paginatedCompleted.data,
        bookingPaid: paginatedPaid.data,
        bookingPagination: paginatedBooking,
        bookingPendingPagination: paginatedPending,
        bookingConfirmedPagination: paginatedConfirmed,
        bookingCompletedPagination:paginatedCompleted,
        bookingPaidPagination: paginatedPaid,
        bookingcopy:booking
    })
})
route.post('/create-booking', async function(req,res){
    if (req.session.authUser) {
    const { bookedServiceIds } = req.body;
    const customerId = req.session.authUser._id;
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
    const customerId = req.session.authUser._id;
    try {
        const booked = await bookingService.findBookedAfterAddShiftById(bookedServiceIds).lean()
        notifier.notify({
            entity: {
                _id: bookedServiceIds,
                name: booked.service.serviceName, // hoặc tên dịch vụ
                notifyUsers: [booked.customer._id], // người nhận
                date: booked.shift?.startTime || new Date(new Date().setHours(0, 0, 0, 0)),// thời gian bắt đầu
            },
            entityType: 'BookedService',
            newStatus:"CANCELLED",
            triggeredBy:booked.inCharge
        });
        let booking = await bookingService.findExistBookingWithoutTime(customerId)
        const shiftAdded = await shiftService.findShiftByBookedService(bookedServiceIds)
        if(shiftAdded)
        {
            await shiftService.deleteShiftById(shiftAdded._id);
        }
        await bookingService.updateAfterDeleteBookedService(booking._id,bookedServiceIds)
        const reloadedBooking = await bookingService.findBookingById(booking._id)
        await bookingService.deleteBookedService(bookedServiceIds);
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
route.get('/schedule', auth, async function(req,res)
{
    const id = String(req.query.id) || 0;
    const bookedService = await bookingService.findBookedServiceUserServiceByBookedId(id)
    if (req.session.authUser){
        res.render('vwBooking/schedule',{
            bookedService: bookedService,
            id:id,
            user: bookedService.customer,
            service: bookedService.service,
            isHome:true
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
        const customer = await userService.findById(req.session.authUser._id)
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
            try{
                    const bookedStatus = await bookingService.findBookedById(bookedServiceId)
                    
                    const statusContext = new ServiceContext(bookedStatus);
                    statusContext.confirm(shiftAdded._id);
                    await statusContext.save();  
                    const booked = await bookingService.findBookedAfterAddShiftById(bookedServiceId).lean()
                      notifier.notify({
                            entity: {
                                _id: bookedServiceId,
                                name: booked.service.serviceName, // hoặc tên dịch vụ
                                notifyUsers: [booked.customer._id], // người nhận
                                shift: booked.shift.startTime, // thời gian bắt đầu
                                date: booked.shift.startTime || null, // ngày bắt đầu
                            },
                            entityType: 'BookedService',
                            newStatus:booked.status,
                            triggeredBy:booked.inCharge
                    });
                    const bookedShiftAdded = await bookingService.findBookedAfterAddShiftById(bookedServiceId)
                    await notifyEmailLater(customer._id,"confirmScheduledBooking",bookedShiftAdded)
                    await bookingService.findBookedAndDeleteAfterSchedule(bookedServiceId)  
                    const url = '/service/booking';
                    res.redirect(url);
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
route.get('/review',auth,async function(req,res){
    const id = String(req.query.id) || 0;
    const bookedService = await bookingService.findBookedServiceUserServiceByBookedId(id)
    const shift = await shiftService.findShiftByBookedService(id)

    res.render('vwBooking/review',{
        bookedService: bookedService,
        id:id,
        user: bookedService.customer,
        service: bookedService.service,
        isHome:true,
        shift:shift
    })
 
});
route.post('/review',async function(req,res){
    if (req.session.authUser) {
        const id = req.query.id
        const rating = req.body.rating
        const review = req.body.review
        const service = await bookingService.findService(id)
        const newReview =
        {
            rating : rating,
            review : review,
            bookedService: id,
        }
        const ret = await serviceService.saveReview(newReview)
        const addedReview = await serviceService.findReviewByBookedId(id)
        const retService = await serviceService.updateReviewSevice(service, addedReview._id)
        const bookedStatus = await bookingService.findBookedById(id)
        const statusContext = new ServiceContext(bookedStatus);
        statusContext.review();
        await statusContext.save(); 
        const booked = await bookingService.findBookedAfterAddShiftById(id).lean()
        notifier.notify({
            entity: {
                _id: booked._id,
                name: booked.service.serviceName, // hoặc tên dịch vụ
                notifyUsers: [booked.customer._id], // người nhận
                date: booked.shift.startTime || null, // thời gian bắt đầu
            },
            entityType: 'BookedService',
            newStatus:booked.status,
            triggeredBy:booked.inCharge
        });
        const url = `/service/detail?id=${service.id}`;
        res.redirect(url);
    }
        
    else{
        res.render('partials/loginRequired',{ showLoginModal: true })
    }
});
export default route;