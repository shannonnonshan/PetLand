import mongoose, { Schema } from "mongoose";

import {Shift} from '../models/Booking.js';

export default {
    insertMany(shifts)
    {
        return Shift.insertMany(shifts)
    },
    findCollapseShift(start,end)
    {
        return Shift.find({
            $or: [
                { startTime: { $lt: end }, endTime: { $gt: start } } 
            ]
        });
    },
    findSameShift(start, end)
    { return Shift.find({
        startTime: { $gte: start }, 
        endTime: { $lte: end } 
    })
    },
    add(entity) {
        const newShift = new Shift(entity);
        return newShift.save();
    }, 
    findShiftByBookedService(bookedServiceId)
    {
        return Shift.findOne({bookedService: bookedServiceId})
    },
    deleteShiftById(id)
    {
        return Shift.findByIdAndDelete(id)
    }
}