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
import BookingContext from '../state/serviceState/bookingContext.js';
import {notifyEmailLater} from '../controllers/service.controller.js';
import supportService from '../services/staff.service.js';

const route = express.Router();

route.get('/manageService/all',auth, async function(req, res){
    if (req.session && req.session.authUser) {
        const id = req.session.authUser.id
        const booking = await bookingService.findShiftedOwner()
        const bookingMyShedule = await bookingService.findBookedByStaff(id)
        const bookingCheckOut = await bookingService.findBookedByStatus()
        
        const bookingPaid = await bookingService.findAllPaid()
        bookingPaid.forEach(booking => {
            console.log(booking.bookedServices);
        });
        console.log(bookingPaid)
        res.render('vwStaff/service', {
            layout: 'staff-layout',
            booking: booking,
            bookingMyShedule: bookingMyShedule,
            bookingCheckOut: bookingCheckOut,
            bookingPaid: bookingPaid
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


// Request Support của Tinh
// Trang danh sách yêu cầu hỗ trợ
route.get('/requestSupport', auth, async (req, res) => {
  const { status } = req.query;

  const [requests, countsAgg, totalCount] = await Promise.all([
    status ? supportService.findByStatus(status) : supportService.findAll(),
    supportService.countByStatus(),
    supportService.countTotal()
  ]);

  const counts = {
    total: totalCount,
    pending: 0,
    responded: 0
  };

  countsAgg.forEach(c => {
    if (c._id === 'pending') counts.pending = c.count;
    if (c._id === 'responded') counts.responded = c.count;
  });

  // Gắn customerEmail từ customerId
  requests.forEach(req => {
    req.customerEmail = req.customerId?.email || 'Unknown';
    req.createdAtFormatted = moment(req.createdAt).format('DD/MM/YYYY HH:mm:ss');
  });

  res.render('vwStaff/list', {
    layout: 'staff-layout',
    requests,
    counts,
    queryStatus: status,
    success: req.query.success
  });
});

// Trang xem chi tiết & trả lời
route.get('/support/:id', auth, async (req, res) => {
  const request = await supportService.findById(req.params.id);
  if (!request) {
    return res.status(404).send('Not found');
  }
  request.id = request._id.toString();
  // Gắn customerEmail
  request.customerEmail = request.customerId?.email || 'Unknown';
  // Format time
  request.createdAtFormatted = moment(request.createdAt).format('DD/MM/YYYY HH:mm:ss');
  if (request.respondedAt) {
    request.respondedAtFormatted = moment(request.respondedAt).format('DD/MM/YYYY HH:mm:ss');
  }
  res.render('vwStaff/detail', {
    layout: 'staff-layout',
    request
  });
});

// Xử lý phản hồi
route.post('/support/:id/reply', auth, async (req, res) => {
  const { reply } = req.body;

  // Kiểm tra xem reply có trống không
  if (!reply) {
    const request = await supportService.findById(req.params.id);
    request.customerEmail = request.customerId?.email || 'Unknown';
    request.id = request._id.toString();
    return res.render('vwStaff/detail', {
      layout: 'staff-layout',
      request,
      error: 'Reply cannot be empty.'
    });
  }

  // Cập nhật phản hồi
  await supportService.replyToRequest(req.params.id, reply);

  // Lấy lại dữ liệu mới sau khi cập nhật
  const updatedRequest = await supportService.findById(req.params.id);

  // Format thời gian
  updatedRequest.customerEmail = updatedRequest.customerId?.email || 'Unknown';
  updatedRequest.id = updatedRequest._id.toString();
  updatedRequest.createdAtFormatted = moment(updatedRequest.createdAt).format('DD/MM/YYYY HH:mm:ss');
  updatedRequest.respondedAtFormatted = moment(updatedRequest.respondedAt).format('DD/MM/YYYY HH:mm:ss');

  // Render lại trang chi tiết với dữ liệu đã cập nhật
  res.render('vwStaff/detail', {
    layout: 'staff-layout',
    request: updatedRequest
  });
});

export default route;