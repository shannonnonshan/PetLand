import mongoose, { Schema } from "mongoose";

import {Service} from '../models/Service.js';

import {Shift} from '../models/Booking.js';
import {Booking, BookedService} from '../models/Booking.js';

export default {
    save(booking){
        const newbooking = new Booking(booking)
        return newbooking.save()
    },
    async saveBookedService(booking)
    {
        return BookedService.findByIdAndUpdate(booking._id).lean()
    },
    findBookingById(id)
    {
        return Booking.findById(id).lean()
    },
    findBookingByIdStatus(id)
    {
        return Booking.findById(id).populate({
            path: 'bookedServices',
            populate: [
                { path: 'inCharge' },
                { path: 'service' },
                { path: 'shift' },
                { path: 'customer'},
            ]
          })
    },
    findBookingByIdEmail(id)
    {
        return Booking.findById(id).populate({
            path: 'bookedServices',
            populate: [
                { path: 'inCharge' },
                { path: 'service' },
                { path: 'shift' },
                { path: 'customer'},
            ]
          }).lean()
    },
    findBookedById(id)
    {
        return BookedService.findById(id).populate('customer').populate('service')
    },
    findBookedAfterAddShiftById(id)
    {
        return BookedService.findById(id).populate('service').populate('shift')
    },
    findExistBooking(customerId)
    {
        return Booking.findOne({
            customer:customerId,
            paymentStatus: 'PENDING', 
            createAt: null
        });
    },
    findExistBookingWhioutTime(customerId)
    {
        return Booking.findOne({
            customer:customerId,
            paymentStatus: 'PENDING', 
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
    async findService(bookedServiceIds)
    {
        const bookedService = await BookedService.findById(bookedServiceIds)
        return Service.findById(bookedService.service)
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
    findBookedServiceById(id)
    {
        return BookedService.findById(id)
        .populate('service').populate('shift').lean().exec()
    },
    
    findBookedServiceByCustomerId(id)
    {
        return BookedService.find({customer:id})
        .populate('service').populate('shift').sort({ updatedAt: -1 }).lean().exec()
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
        return Booking.find({customer:id, paymentStatus}).sort({ updatedAt: -1 }) 
    },
    findPendingBookedService(customerId)
    {
        return BookedService.find({customer: customerId, status: 'pending'})
        .populate('service').sort({ updatedAt: -1 }).lean().exec()
    },
    findCompletedBookedService(customerId)
    {
        return BookedService.find({customer: customerId, status: 'completed'})
        .populate('service').populate('shift').sort({ updatedAt: -1 }) .lean().exec()
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
        .sort({ updatedAt: -1 })   
        .lean() 
        .exec();
    },
    async findPaidBookedService(customerId)
    {
        const bookings = await Booking.find({customer: customerId, paymentStatus: 'PAID'})
        .populate({
            path: 'bookedServices',
            populate: [
                { path: 'inCharge' },
                { path: 'service' },
                { path: 'shift' }
            ]
          })
          .sort({ updatedAt: -1 }) 
          .lean()
          .exec();
        
        bookings.sort((a, b) => {
        const aHasReviewed = a.bookedServices.some(s => s.status === 'reviewed');
        const bHasReviewed = b.bookedServices.some(s => s.status === 'reviewed');

        if (aHasReviewed && !bHasReviewed) return 1;
        if (!aHasReviewed && bHasReviewed) return -1;
        return 0;
        });

        return bookings;
    },
    findAllPaid()
    {
        return Booking.find({paymentStatus: 'PAID'})
        .populate({
            path: 'bookedServices',
            populate: [
                { path: 'inCharge' },
                { path: 'service' },
                { path: 'shift' }
            ]
        })
        .sort({ updatedAt: -1 }) 
        .populate('accountant')
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
    findBookingOwner()
    {
        return BookedService.find({ status: { $ne: "pending" } })
        .populate('customer') 
        .populate('inCharge')  
        .populate('service')   // Populate service (thông tin dịch vụ)
        .populate('shift')
        .sort({ updatedAt: -1 })  
        .lean()
        .exec();
    },
    
    findRejectedOwner()
    {
        return BookedService.find({ status: "cancelled" })
        .populate('customer') 
        .populate('inCharge')  
        .populate('service')   // Populate service (thông tin dịch vụ)
        .populate('shift')
        .sort({ updatedAt: -1 })  
        .lean()
        .exec();
    },
    findWaitShiftingOwner()
    {
        return BookedService.find({ inCharge: null, status: 'confirmed'})
        .populate('customer') 
        .populate('inCharge')  
        .populate('service')   // Populate service (thông tin dịch vụ)
        .populate('shift')
        .sort({ updatedAt: -1 })  
        .lean()
        .exec();
    },
    findCompletedBookedServiceOwner()
    {
        return BookedService.find({ status: 'completed'})
        .populate('customer') 
        .populate('inCharge')  
        .populate('service')   // Populate service (thông tin dịch vụ)
        .populate('shift')
        .sort({ updatedAt: -1 })  
        .lean()
        .exec();
    },
    findShiftedOwner()
    {
        return BookedService.find({inCharge: { $ne: null, $exists: true }})
        .populate('customer') 
        .populate('inCharge')  
        .populate('service')   // Populate service (thông tin dịch vụ)
        .populate('shift')
        .sort({ updatedAt: -1 })  
        .lean()
        .exec();
    },
    findBookedByStaff(id)
    {
        return BookedService.find({inCharge: id})
        .populate('customer') 
        .populate('inCharge')  
        .populate('service')   // Populate service (thông tin dịch vụ)
        .populate('shift')
        .sort({ updatedAt: -1 })  
        .lean()
        .exec();
    },
    async findBookedByStatus() {
        const bookings = await Booking.find({paymentStatus:{ $ne: "PAID"}}).populate({
            path: 'bookedServices',
            populate: [
                { path: 'inCharge' },
                { path: 'service' },
                { path: 'shift' }
            ]
        }).sort({ updatedAt: -1 }) .lean();
        console.log(bookings)
        const filteredBookings = bookings.filter(booking =>
            booking.bookedServices.length > 0 &&
            booking.bookedServices.every(bs => 
                typeof bs.status === 'string' && bs.status.trim().toLowerCase() === 'completed'
            )
        );
        console.log(filteredBookings)
        return filteredBookings;
    },
    
    findPaidBookedOwner() {
        return Booking.find({ paymentStatus: 'COMPLETED' }) // nếu bạn dùng 'PAID' thì đảm bảo enum đúng
          .populate({
            path: 'bookedServices',
            populate: [
              { path: 'service' },
              { path: 'customer' },
              { path: 'shift' },
              { path: 'inCharge' }
            ]
          }).sort({ updatedAt: -1 }) 
          .lean()
          .exec();
      },
    findOneWaitShiftingOwner(id)
    {
        return BookedService.findOne({ _id: id })
        .populate('customer') 
        .populate('service')   
        .populate('shift') 
        .lean()
        .exec();
    },
    updateInCharge(id, inCharge)
    {
        return BookedService.findByIdAndUpdate(id,{ inCharge: inCharge })
    }

}