const express = require('express');
const router = express.Router({mergeParams : true})
const catchAsync = require('../utils/catchAsync')
const expressError = require('../utils/expressError')
const Review = require('../models/review')
const {reviewSchema} = require('../JoiSchemas')
const Campground = require('../models/campground')
const flash = require('connect-flash')

const validateReview = (req,res,next) => {
    const {error} = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(er => er.message).join(',')
        throw new expressError(msg,400)
    }
    else{
        next()
    }
}

router.post('/',validateReview,catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success','Created a new review!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:reviewId',catchAsync(async(req,res)=>{
    const {id,reviewId} = req.params
    await Campground.findByIdAndUpdate(id,{$pull: {reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId)
    req.flash('success','Successfully deleted a review.')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router