import mongoose, { Schema } from "mongoose";

import {Service} from '../models/Service.js';

import {Shift} from '../models/Booking.js';
import {Booking, BookedService} from '../models/Booking.js';

export default {
    save(booking){
        const newbooking = new Booking(booking)
        return newbooking.save()
    },
    findExistBooking(customerId)
    {
        return Booking.find({
            customer:customerId,
            paymentStatus: 'PENDING'
        });
    },
    findService(bookedServiceIds)
    {
        return Service.findById(bookedServiceIds)
    },
    insertBookedService(bookedService)
    {
        const newBookedService = new BookedService(bookedService);
        return newBookedService.save();
    },
    saveNewBookedService( booking,bookedServiceId) {
        booking.bookedServices.push(bookedServiceId);
        return booking.save();
    },
    findBookedService(customerId, bookedServiceIds, status)
    {
        return BookedService.findOne({customer:customerId,service: bookedServiceIds, status: status}).lean()
    },
    findBookedServiceById(customerId)
    {
        return BookedService.find({customer:customerId})
        .populate('service').lean().exec()
    },
    deleteBookedServiceById(temp)
    {
        return BookedService.findByIdAndDelete(temp)
    },
    findByCustomer(id)
    {
        return Booking.find({customer:id})
    },
    findByStatus(id, paymentStatus)
    {
        return Booking.find({customer:id, paymentStatus})
    },
    findPendingBookedService(customerId)
    {
        return BookedService.find({customer: customerId, status: 'pending'})
        .populate('service').lean().exec()
    },
    findCompletedBookedService(customerId)
    {
        return BookedService.find({customer: customerId, status: 'completed'})
        .populate('service').lean().exec()
    },
    findScheduledBookedService(customerId)
    {
        return BookedService.find({customer: customerId, status: 'confirmed'})
        .populate('service').lean().exec()
    },
    findPaidBookedService(customerId)
    {
        return Booking.find({customer: customerId, status: 'PAID'})
        .populate({
            path: 'bookedServices',
            populate: {
              path: 'service', 
            }
          })
          .lean()
          .exec();
    },

}