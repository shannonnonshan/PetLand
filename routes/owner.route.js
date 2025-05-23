import express, { Router } from 'express';
import petService from '../services/pet.service.js';
import userService from '../services/user.service.js';
import shiftService from '../services/shift.service.js';
import bcrypt from 'bcryptjs'; 
import {authOwner} from '../middlewares/auth.mdw.js';
import bookingService from '../services/booking.service.js';
import ServiceContext from '../state/serviceState/serviceContext.js';
import {notifyEmailLater} from '../controllers/service.controller.js';
import notifier from '../observer/notificationObserver.js';
import { paginateQuery, generateServiceId } from '../utils/features.js';
const route = express.Router();

route.get('/managePet/all', authOwner, async function(req, res){
    
    const list = await petService.findAll().lean();
    res.render('vwOwner/pet/approved', {
        layout: 'owner-layout',
        list: list
    })
    
})
route.get('/managePet/pending',authOwner, async function(req, res){
    

    const list = await petService.findAllBy(1).lean();
    res.render('vwOwner/pet/pending', {
        layout: 'owner-layout',
        list: list
    })
   
})
route.get('/managePet/approved',authOwner, async function(req, res){
    

    const list = await petService.findAllBy(2).lean();
    res.render('vwOwner/pet/approved', {
        layout: 'owner-layout',
        list: list
    })
     
})
route.get('/managePet/adopt_requested', authOwner, async function(req, res){
    

    const list = await petService.findAllBy(3).lean();
    res.render('vwOwner/pet/pending-adopt', {
        layout: 'owner-layout',
        list: list
    })
})
route.get('/managePet/adopt_approved',authOwner , async function(req, res){
    

    const list = await petService.findAllBy(4).lean();
    res.render('vwOwner/pet/completed-adopt', {
        layout: 'owner-layout',
        list: list
    })
})
route.get('/managePet/rejected',authOwner, async function(req, res){
    

    const list = await petService.findAllBy(6).lean();
    res.render('vwOwner/pet/approved', {
        layout: 'owner-layout',
        list: list
    })
     
})
route.get('/managePet/adopt_completed',authOwner, async function(req, res){
    

    const list = await petService.findAllBy(5).lean();
    res.render('vwOwner/pet/approved', {
        layout: 'owner-layout',
        list: list
    })
     
})

route.get('/home', authOwner, function(req, res){
    

    res.render('vwOwner/home', {
        layout: 'owner-layout',
    })
     
})
route.get('/manageService/shift',authOwner, async function(req, res){
    const booking = await bookingService.findShiftedOwner()
    res.render('vwOwner/service/shift', {
        layout: 'owner-layout',
        booking:booking
    })
})

route.post('/notify-all', authOwner, async function(req,res)
{
    const message = req.body.message
    try {
        notifier.notify({
            message: message,
            entityType: 'Maintenance',
            triggeredBy: req.session.authUser._id,
        });
    res.redirect(req.get('referer'));
    }catch (error) {
        console.error(error);
    }

})

route.get('/manageService/booking', authOwner, async function(req, res){
    const pageAll = parseInt(req.query.pageAll) || 1;
    const pageWaitShifting = parseInt(req.query.pageWaitShifting) || 1;
    const pageRejected = parseInt(req.query.pageRejected) || 1;
    const pagePaid = parseInt(req.query.pagePaid) || 1;
    const pageCompleted = parseInt(req.query.pageCompleted) || 1;
    const limit=6;

    const booking = await bookingService.findBookingOwner()
    const bookingRejected = await bookingService.findRejectedOwner()
    const bookingWaitShifting = await bookingService.findWaitShiftingOwner()
    const bookingCompleted = await bookingService.findCompletedBookedServiceOwner()
    const bookingPaid = await bookingService.findAllPaid()

    const paginatedBooking = await paginateQuery(booking, pageAll, limit);
    const paginatedRejected = await paginateQuery(bookingRejected, pageRejected, limit);
    const paginatedWaitShifting = await paginateQuery(bookingWaitShifting,pageWaitShifting, limit);
    const paginatedCompleted = await paginateQuery(bookingCompleted, pageCompleted, limit);
    const paginatedPaid = await paginateQuery(bookingPaid, pagePaid, limit);
    res.render('vwOwner/service/booking', {
        layout: 'owner-layout',
        booking: paginatedBooking.data,
        bookingRejected:  paginatedRejected.data,
        bookingWaitShifting: paginatedWaitShifting.data,
        bookingCompleted:paginatedCompleted.data,
        bookingPaid: paginatedPaid.data,
        bookingPagination: paginatedBooking,
        bookingRejectedPagination: paginatedRejected,
        bookingWaitShiftingPagination: paginatedWaitShifting,
        bookingCompletedPagination:paginatedCompleted,
        bookingPaidPagination: paginatedPaid,

    })
    
})
route.post('/manageService/reject-booking',authOwner,async function(req,res){
    const { bookedServiceIds } = req.body;
    try {
        const booked = await bookingService.findBookedAfterAddShiftById(bookedServiceIds).lean()
        notifier.notify({
            entity: {
                _id: bookedServiceIds,
                name: booked.service.serviceName, // hoặc tên dịch vụ
                notifyUsers: [booked.customer._id], // người nhận
                date: booked.shift?.startTime || new DateNow(),// thời gian bắt đầu
            },
            entityType: 'BookedService',
            newStatus:"CANCELLED",
            triggeredBy:booked.inCharge,  
            content: " because of the store schedule. Thank you for your understanding",
        });
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

route.get('/manageService/shift-staff', authOwner, async function(req,res)
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

route.post('/manageService/shift-staff', authOwner, async function(req,res)
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

route.get('/statistics',authOwner, async function(req, res){
    res.render('vwOwner/statistics', {
        layout: 'owner-layout',
    })
})

route.get('/manageStaff/listStaff',authOwner, async function(req, res){
    const list = await userService.findStaff().lean();
    res.render('vwOwner/staff/listStaff', {
        layout: 'owner-layout',
        list: list
    })
})
import multer from 'multer';
const upload = multer(); // for form-data without file upload

route.get('/manageStaff/create',authOwner, async function(req, res){
    res.render('vwOwner/staff/createStaff', {
        layout: 'owner-layout',
    })
})

route.get('/manageStaff/update', authOwner, async function(req, res) {
    const id = req.query.id;
    const staff = await userService.findById(id).lean();
    if (!staff) {
        return res.status(404).send("Staff not found");
    }
    res.render('vwOwner/staff/updateStaff', {
        layout: 'owner-layout',
        staff
    });
});


route.post('/createStaff', async function(req, res) {

        const { username, name, email, phone, gender } = req.body;
        const hash_password = bcrypt.hashSync(req.body.raw_password, 8);

        const staff = {
            name: name,
            username: username,
            password: hash_password,
            phone: phone,
            gender: gender,
            email: email,
            role: 'Staff',
            createAt: Date.now()
        };

        await userService.add(staff);
       res.redirect('/owner/manageStaff/listStaff');
});


route.post('/updateStaff/:id', async function(req, res) {
    const { id } = req.params;
    const { username, name, email, phone, gender } = req.body;
    const user = await userService.findById(id) || null;
    if(user){
         const staffData = {
            username,
            name,
            email,
            phone,
            gender,
        };
        await userService.updateStaff(id, staffData);
        res.redirect('/owner/manageStaff/listStaff');
    }
    else{
        res.send({message: "Not found!"});
    }
   
});

route.post('/deleteStaff/:id', async function(req, res){
    const {id} = req.params;
    await userService.deleteStaff(id);
    res.json({ success: true, message: "Staff deleted successfully" });
});
route.get('/service-list', authOwner, async (req, res) => {
  try {
    let list = await serviceService.findAll().lean();
    if (req.query.id) {
        list = list.filter(service  => service.petType === Number(req.query.id));
    } 
    res.render('vwOwner/service/serviceList', {
      layout: 'owner-layout',
      list: list,
    });
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).send('Internal Server Error');
  }
});
route.get('/create-service', authOwner, async (req, res) => {
  try {
    res.render('vwOwner/service/createService', {
      layout: 'owner-layout',
    });
  } catch (err) {
    console.error('Error fetching pet types:', err);
    res.status(500).send('Internal Server Error');
  }
});
route.post('/create-service', async (req, res) => {
  try {
    const generatedId = generateServiceId();

    const data = { ...req.body, id: generatedId };

    await serviceService.createService(data);

    res.redirect('/owner/service-list');
  } catch (err) {
    console.error('Error creating service:', err);
    res.status(500).send('Internal Server Error');
  }
});
export default route;