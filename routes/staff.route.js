import express from 'express';
import petService from '../services/pet.service.js';
import userService from '../services/user.service.js';
import shiftService from '../services/shift.service.js';
import bcrypt from 'bcryptjs'; 
import dotenv from 'dotenv';
import {auth,authStaff} from '../middlewares/auth.mdw.js';
import nodemailer from 'nodemailer';
import moment from 'moment';
import bookingService from '../services/booking.service.js';
import ServiceContext from '../state/serviceState/serviceContext.js';
import BookingContext from '../state/serviceState/bookingContext.js';
import {notifyEmailLater} from '../controllers/service.controller.js';
import supportService from '../services/support.service.js';
import { sendServiceEmail } from '../utils/mailer.js';

import serviceService from '../services/service.service.js';
import { paginateQuery } from '../utils/pagination.js';
const route = express.Router();

route.get('/manageService/all',authStaff, async function(req, res){
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
route.post('/manageService/complete',authStaff,async function(req,res){
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
route.post('/manageService/checkout',authStaff,async function(req,res){
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
route.post('/manageService/response-review',authStaff,async function(req,res){
    const {reviewId,response } = req.body;
    try {
        const ret = await serviceService.updateReviewResponse(reviewId,response)
        res.redirect(req.get('referer'));
        } catch (error) {
        console.error(error);
        res.status(500).send('Error updating booking');
        }
});
route.post('/manageService/hide-review',authStaff,async function(req,res){
    const reviewId = req.query.id;
    try {
        const ret = await serviceService.updateReviewStatus(reviewId,false)
        res.redirect(req.get('referer'));
        } catch (error) {
        console.error(error);
        res.status(500).send('Error updating booking');
        }
});
route.post('/manageService/unhide-review',authStaff,async function(req,res){
    const reviewId = req.query.id;
    try {
        const ret = await serviceService.updateReviewStatus(reviewId,true)
        res.redirect(req.get('referer'));
        } catch (error) {
        console.error(error);
        res.status(500).send('Error updating booking');
      }
    });


route.get('/requestSupport', auth, async (req, res) => {
  try{
  const { status } = req.query;

  const [requests, countsAgg, totalCount] = await Promise.all([
    status ? supportService.findFeedBackByStatus(status) : supportService.findAllFeedBack(),
    supportService.countFeedBackByStatus(),
    supportService.countTotalFeedBack()
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

  const formattedRequests = requests.map(r => ({
    ...r,
    customerEmail: r.customerId?.email || '',
    customerName: r.customerId?.name || '',
    createdAtFormatted: moment(r.createdAt).utcOffset(7).format('DD/MM/YYYY HH:mm:ss'),
  }));

  res.render('vwStaff/list', {
    layout: 'staff-layout',
    requests: formattedRequests,
    counts,
    queryStatus: status,
    success: req.query.success
  });
}catch( err)
  {
      console.error(err);
  }
});

// Trang xem chi tiết & trả lời
route.get('/support/:id', auth, async (req, res) => {
  const request = await supportService.findFeedBackById(req.params.id).lean();
  const email = (request.customerId.email) || null;
  if (!request) {
    return res.status(404).send('Not found');
  }
  request.id = request._id.toString();
  request.createdAtFormatted = moment(request.createdAt).utcOffset(7).format('DD/MM/YYYY HH:mm:ss');
  if (request.respondedAt) {
    request.respondedAtFormatted = moment(req.respondedAt).format('DD/MM/YYYY HH:mm:ss');
  }
  res.render('vwStaff/detail', {
    layout: 'staff-layout',
    request,
    email
  });
});

// Xử lý phản hồi
route.post('/support/:id/reply', auth, async (req, res) => {
  const { reply, email } = req.body;
  
  if (!reply) {
    const request = await supportService.findFeedBackById(req.params.id);
    request.id = request._id.toString();
    request.createdAtFormatted = moment(request.createdAt).utcOffset(7).format('DD/MM/YYYY HH:mm:ss');
    return res.render('vwStaff/detail', {
      layout: 'staff-layout',
      request,
      error: 'Reply cannot be empty.'
    });
  }

  // Cập nhật phản hồi
  await supportService.replyToRequest(req.params.id, reply);

  // Lấy lại dữ liệu mới sau khi cập nhật
  const updatedRequest = await supportService.findFeedBackById(req.params.id);

  // Gửi email đến khách hàng
  try {
    await sendServiceEmail(
      email, // Địa chỉ email người nhận
      'Your support request has been answered', // Tiêu đề email
      `<p>Dear Customer,</p><p>${reply}</p><p>Thank you for contacting us.</p>` // Nội dung HTML
    );
  } catch (err) {
    console.error('Error sending email:', err);
  }

  // Format thời gian
  updatedRequest.id = updatedRequest._id.toString();
  updatedRequest.createdAtFormatted = moment(updatedRequest.createdAt).utcOffset(7).format('DD/MM/YYYY HH:mm:ss');
  updatedRequest.respondedAtFormatted = moment(updatedRequest.respondedAt).utcOffset(7).format('DD/MM/YYYY HH:mm:ss');

  res.render('vwStaff/detail', {
    layout: 'staff-layout',
    request: updatedRequest,
    success: 'The message is sent.'
  });
});
  

export default route;