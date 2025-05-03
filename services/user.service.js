

import User from '../models/User.js';
import OtpUser from "../models/OtpUser.js";

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
    }
};