

import User from '../models/User.js';
import OtpUser from "../models/OtpUser.js";
import { BookedService } from '../models/Booking.js';
import { Shift } from '../models/Booking.js';

export default {
    findAll() {
        return User.find()  
    },
    // Tìm người dùng theo tên đăng nhập
    findById(id) {
        return User.findById(id)
    },
    findByUsername(username) {
        return User.findOne({ username: username })
    },
    
    findByEmail(email) {
        return User.findOne({ email: email });
    },

    // Thêm người dùng mới
    add(entity) {
        const user = new User(entity);
        return user.save();
    }, 

    updateUser(username, user) {
        return User.findByIdAndUpdate(username, user, { new: true });
    }, 

    updateUserforShift(id,name, phone, email) {
        return User.findByIdAndUpdate(id,{name: name,phone:phone,email:email});
    },
    
    updateStaff(id, entity) {
        return User.findByIdAndUpdate(id, { username: entity.username, password: entity.password, name: entity.name, phone: entity.phone, email: entity.email, gender: entity.gender, avatar: entity.avatar});
    },
    deleteStaff(id) {
        return User.findByIdAndDelete(id);
    },
    addOTP(entity) {
        const otp = new OtpUser(entity)
        return otp.save();
    }, 

    findOTPByEmail(email) {
        return OtpUser.findOne({ email: email });
    },

    updatePassword(email, username, newPassword) {
        return User.findOneAndUpdate(
            { 
                email: email, 
                username: username,
            },          
            { $set: { password: newPassword } }, // cập nhật password
            { new: true }                     // trả về document mới sau khi update
        );
    },
    

    delOTP(otp)
    {
        return OtpUser.deleteOne({otp: otp})
    },
    findByRequired(customer)
    {
        return User.findOne(customer)
    },
    findStaff()
    { 
        return User.find({role:"Staff"})
    },
    async findStaffAvailableDuring(startTime, endTime) {
        return User.find({
            role: 'Staff',
            _id: {
                $nin: await BookedService.find({
                    $or: [
                        { inCharge: { $ne: null } },
                        { inCharge: { $exists: true } }
                    ],
                    shift: {
                        $in: await Shift.find({
                            $or: [
                                { 
                                    startTime: { $lt: endTime }, 
                                    endTime: { $gt: startTime } 
                                }
                            ]
                        }).distinct('_id')
                    }
                }).distinct('inCharge')
            }
        }).lean();
    }
};