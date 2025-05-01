import mongoose, { Schema } from "mongoose";

import {Service} from '../models/Service.js';

export default {
    findAll() {
         return Service.find()  
    },
    findByServiceId(id)
    {
        return Service.findOne({id:id}).lean()
    },
    findByName(name)
    {
        return Service.findOne({serviceName: name})
    },
    findByPetType(petType)
    {
        return Service.find({ petType: petType }).lean()
    }
};