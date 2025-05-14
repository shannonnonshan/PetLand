import express from 'express';
import auth from '../middlewares/auth.mdw.js'; // middleware kiểm tra đăng nhập
import SupportRequest from '../models/SupportRequest.js';

const route = express.Router();

// Route GET cho feedback
route.get('/feedback', auth, (req, res) => {
  res.render('vwCustomer/customer-support', {
    layout: 'main',
  });
});

// Route POST cho feedback
route.post('/feedback', auth, async (req, res) => {
    console.log('Session Auth User:', req.session.authUser); 
  const { type, message } = req.body;
  

  if (!message || message.trim() === '') {
    return res.render('vwCustomer/customer-support', {
      layout: 'main',
      error: 'Message cannot be empty.',
    });
  }

  try {
  // Kiểm tra xem user đã đăng nhập hay chưa
  if (!req.session.authUser) {
    return res.render('vwCustomer/customer-support', {
      layout: 'main',
      error: 'User not authenticated.',
    });
  }

  // Tạo feedback mới
  const supportRequest = await SupportRequest.create({
    customerId: req.session.authUser.id,  // ID người dùng từ session
    customerEmail: req.session.authUser.email,  // Email của khách hàng từ session
    subject: type,
    message: message,
    status: 'pending',  // Mặc định là pending
    createdAt: new Date(),
  });

  console.log('Support Request Created:', supportRequest);  // Log thông tin đối tượng tạo mới
  res.render('vwCustomer/customer-support', {
    layout: 'main',
    success: 'Your request has been sent.',
  });
} catch (error) {
  console.error('Error creating support request:', error);  // Log chi tiết lỗi
  res.render('vwCustomer/customer-support', {
    layout: 'main',
    error: 'There was an issue submitting your request. Please try again later.',
  });
}});

// Export route như ES module
export default route;