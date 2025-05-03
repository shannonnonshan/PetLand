import mongoose, { Schema } from "mongoose";

import {Service} from '../models/Service.js';

import {Shift} from '../models/Booking.js';

export default {
    insertMany(shifts)
    {
        return Shift.insertMany(shifts)
    }
}