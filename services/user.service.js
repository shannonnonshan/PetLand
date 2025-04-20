import mongoose, { Schema } from "mongoose";

import User from '../models/User.js';

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
    
    // Tìm người dùng theo email
    findByEmail(email) {
        return User.findOne({ email: email });
    },

    // Thêm người dùng mới
    add(entity) {
        return entity.add()
    }, 

    updateUser(id, user) {
        return User.findByIdAndUpdate(id, user, { new: true });
    }, 
};