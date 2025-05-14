import mongoose, { Schema } from "mongoose";

import {Service} from '../models/Service.js';
import { Review } from "../models/Review.js";

export default {
    findAll() {
         return Service.find()  
    },
    findByServiceId(id)
    {
        return Service.findOne({id:id}).populate('reviews').lean()
    },
    findByName(name)
    {
        return Service.findOne({serviceName: name})
    },
    findByPetType(petType)
    {
        return Service.find({ petType: petType }).lean()
    },
    saveReview(review)
    {
        const newReview = new Review(review)
        return newReview.save()
    },
    findReviewByBookedId(id)
    {
        return Review.findOne({bookedService: id})
    },
    updateReviewSevice(id,addedReview)
    {
        return Service.findByIdAndUpdate(id, { $push: { reviews: addedReview } })

    },
    findReviewService(id)
    {
        return Review.findById(id)
    },
};