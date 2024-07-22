const express = require('express')
const app = express()
const path = require('path')
var methodOverride = require('method-override')
var bodyParser = require('body-parser')
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const campground = require('./models/campground')
var ejsMate = require('ejs-mate')
// const campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp').
    then(() => {
        console.log("Connection Successful!!!")
    })
    .catch(error => {
      console.log("Oh no error")
      console.log(error)
    
})

const db = mongoose.connection
db.on("error",console.error.bind(console,"connection error:"))
db.once("open",() =>{
    console.log("Database connected")
})


app.engine('ejs',ejsMate)
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'./views'))

app.use(bodyParser.urlencoded({extended:true}))
app.use(methodOverride('_method'))

app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/campgrounds',async(req,res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index',{campgrounds})
})

app.get('/campgrounds/new',(req,res) => {
    res.render('campgrounds/new')
})

app.post('/campgrounds',async(req,res) => {
    const campground = new Campground(req.body.campground)
    await campground.save()
    // res.send(req.body.campground)
    res.redirect(`/campgrounds/${campground._id}`)
})

app.get('/campgrounds/:id',async(req,res) => {
    const campgrounds = await Campground.findById(req.params.id)
    res.render('campgrounds/show',{campgrounds})
})

app.get('/campgrounds/:id/edit',async(req,res) => {
    const campgrounds = await Campground.findById(req.params.id)
    res.render('campgrounds/edit',{campgrounds})
})

app.put('/campgrounds/:id',async(req,res)=>{
    const {id} = req.params
    const campground = await Campground.findByIdAndUpdate(id,{... req.body.campground})
    // updateCG.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

app.get('/makecampground', async(req,res)=>{
    const camp = new Campground({title : 'My Backyard',description:"Free Walk"})
    await camp.save()
    res.send('camp')
})

app.delete('/campgrounds/:id',async(req,res)=>{
    const{id} = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
})

app.listen(3000,()=>{
    console.log("Serving port 3000!!!")
})