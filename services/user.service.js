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
};