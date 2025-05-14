import User from '../models/User.js';
import OtpUser from "../models/OtpUser.js";
import { BookedService } from '../models/Booking.js';
import { Shift } from '../models/Booking.js';
import SupportRequest from '../models/SupportRequest.js';

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
    },

    findAllFeedBack() {
    return SupportRequest.find()
      .populate('customerId', 'email name')
      .sort({ createdAt: -1 })
      .lean();
  },

  findFeedBackByStatus(status) {
    return SupportRequest.find({ status })
      .populate('customerId', 'email name')
      .sort({ createdAt: -1 })
      .lean();
  },

  findFeedBackById(id) {
    return SupportRequest.findById(id)
      .populate('customerId', 'email name')
      .lean();
  },

  replyToRequest(id, response) {
    return SupportRequest.findByIdAndUpdate(
      id,
      {
        status: 'responded',
        response: response,
        respondedAt: new Date()
      },
      { new: true }
    );
  },

  countFeedBackByStatus() {
    return SupportRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
  },

  countTotalFeedBack() {
    return SupportRequest.countDocuments();
  }
};