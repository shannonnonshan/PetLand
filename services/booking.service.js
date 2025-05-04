import mongoose, { Schema } from "mongoose";

import {Service} from '../models/Service.js';

import {Shift} from '../models/Booking.js';
import {Booking, BookedService} from '../models/Booking.js';

export default {
    save(booking){
        const newbooking = new Booking(booking)
        return newbooking.save()
    },
    findBookingById(id)
    {
        return Booking.findById(id).lean()
    },
    findExistBooking(customerId)
    {
        return Booking.findOne({
            customer:customerId,
            paymentStatus: 'PENDING'
        });
    },
    findExistBookingByTime(formattedDate){
        return Booking.findOne({
            createAt: formattedDate,
            paymentStatus: 'PENDING'
        });
    },
    async findBookedAndDeleteAfterSchedule(bookedServiceId)
    {
        const result = await Booking.updateOne(
            { bookedServices: bookedServiceId, createAt: null },
            { $pull: { bookedServices: bookedServiceId } }
        );
    
        const booking = await Booking.findOne({ bookedServices: { $size: 0 }, createAt: null });
    
        if (booking) {
            await Booking.deleteOne({ _id: booking._id });
        }
    
        return result;
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
    saveNewBookedService(booking,bookedServiceId) {
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
        .populate('service').populate('shift').lean().exec()
    },
    findBookedServiceByBookedId(id){
        return BookedService.findById(id)
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
        .populate('service').populate('shift').lean().exec()
    },
    async findScheduledBookedService(customerId)
    {
        const bookedComplete= await BookedService.find({ customer: customerId, status:'confirmed'})
        if (!bookedComplete || bookedComplete.length === 0) {
            return [];
        }
        return BookedService.find({ customer: customerId, status:'confirmed'})
        .populate('shift')
        .populate('service')  
        .lean() 
        .exec();
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
    findBookedServiceUserServiceByBookedId(id)
    {
        return BookedService.findById(id)
        .populate('customer')  // Populate customer (thông tin người dùng)
        .populate('service')   // Populate service (thông tin dịch vụ)
        .lean()
        .exec()
    },
    deleteBookedService(id)
    {
        return BookedService.findByIdAndDelete(id)
    },
    updateAfterDeleteBookedService(bookingId,bookedServiceIds)
    {
        return Booking.findByIdAndUpdate(
            bookingId,
            { $pull: { bookedServices: bookedServiceIds } }, // xóa phần tử khỏi mảng
        );
    },
    deleteBookingById(id)
    {
        return Booking.findByIdAndDelete(id)
    },
    updateStatusBookedService(bookedServiceId,status, shift)
    {
        return BookedService.findByIdAndUpdate(bookedServiceId,{status: status,shift:shift})
    }

}