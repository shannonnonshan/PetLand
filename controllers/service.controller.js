import User from '../models/User.js';
import { sendServiceEmail } from '../utils/mailer.js';
import moment from 'moment';
import{ Booking, BookedService, Shift} from '../models/Booking.js';

function buildServiceEmailTemplate(type, bookedService) {
    switch (type) {
      case 'confirmScheduledBooking':
        return {
          subject: "Your Service Has Been Scheduled",
          html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 24px; border-radius: 8px;">
              <h2 style="color: #2c3e50;">Service Booking Confirmed</h2>
              <p>Your booking for the service <strong style="color: #2e86de;">${bookedService.service.serviceName}</strong> has been successfully scheduled.</p>
              <p>The scheduled date is: <strong style="color: #27ae60;">${moment(bookedService.shift.startTime).format('DD/MM/YYYY HH:mm')}</strong></p>
              <p>Thank you for choosing <strong style="color: #2c3e50;">Petland Services</strong>. We look forward to serving you.</p>
              <hr style="margin: 24px 0; border: none; border-top: 1px solid #ccc;">
              <p style="font-size: 13px; color: #888;">This is an automated email. Please do not reply directly to this message.</p>
            </div>
          `
        };
  
      case 'confirmPaid':
        return {
          subject: "Your Payment Has Been Received",
          html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 24px; border-radius: 8px;">
            <h2 style="color: #2c3e50;">Payment Confirmed</h2>
            <p>Your payment for the following service(s) has been successfully processed:</p>
            ${bookedService.bookedServices.map(bs => `
            <p>
                <strong style="color: #2e86de;">${bs.service.serviceName}</strong> - 
                <span style="color: #27ae60;">${bs.service.price} VND</span>
            </p>
            `).join('')}
            <p>Scheduled service date: <strong style="color: #27ae60;">${moment(bookedService.createAt).format('DD/MM/YYYY')}</strong></p>
            <p>Thank you for trusting <strong style="color: #2c3e50;">Petland Services</strong>. We're excited to assist you.</p>
            <hr style="margin: 24px 0; border: none; border-top: 1px solid #ccc;">
            <p style="font-size: 13px; color: #888;">This is an automated email. Please do not reply directly to this message.</p>
        </div>
        `
        };
  
      case 'rejectService':
        return {
          subject: "Service Booking Rejected",
          html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; padding: 24px; border-radius: 8px;">
              <h2 style="color: #c0392b;">Service Request Rejected</h2>
              <p>Unfortunately, your request for the service <strong style="color: #2e86de;">${bookedService.service.serviceName}</strong> has been rejected.</p>
              <p>We apologize for the inconvenience. Please contact us or try booking another time slot through <strong style="color: #2c3e50;">Petland Services</strong>.</p>
              <hr style="margin: 24px 0; border: none; border-top: 1px solid #ccc;">
              <p style="font-size: 13px; color: #888;">This is an automated email. Please do not reply directly to this message.</p>
            </div>
          `
        };
  
      default:
        return { subject: '', html: '' };
    }
  }

export function notifyEmailLater(userId, type, service) {
    setTimeout(async () => {
      try {
        const user = await User.findById(userId).lean();
        if (!user?.email) return;
  
        const { subject, html } = buildServiceEmailTemplate(type, service);
        await sendServiceEmail(user.email, subject, html);
      } catch (err) {
        console.error('Error sending delayed email:', err);
      }
    }, 0); // gửi ngay sau khi event loop rảnh
  }