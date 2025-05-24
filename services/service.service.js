import {Service} from '../models/Service.js';
import { Review } from "../models/Review.js";
import { ServiceBuilder } from '../builder/serviceBuilder.js';
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
    findReviewByService(id)
    {
        return Review.find()
    },
    updateReviewResponse(reviewId,response)
    {
        return Review.findByIdAndUpdate(reviewId,{response:response})
    },
    updateReviewStatus(reviewId,status)
    {
        return Review.findByIdAndUpdate(reviewId,{status:status})
    },
    createService(serviceData) {
        const service = new ServiceBuilder()
            .setId(serviceData.id)
            .setServiceName(serviceData.serviceName)
            .setPetType(serviceData.petType)
            .setDescription(serviceData.description)
            .setShortDescription(serviceData.shortDescription)
            .setPrice(serviceData.price)
            .setDuration(serviceData.duration)
            .setImageUrl(serviceData.imageUrl)
            .setHidden(serviceData.hidden)
            .build();
        return Service.create(service);
    },
};