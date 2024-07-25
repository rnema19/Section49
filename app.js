const express = require('express')
const path = require('path')
const mongoose = require('mongoose');
var ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const expressError = require('./utils/expressError');
var methodOverride = require('method-override')

const campgrounds = require('./routes/campgrounds')
const reviews = require('./routes/reviews')
// const cookie = require('express-session/session/cookie')

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

const app = express()

app.engine('ejs',ejsMate)
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'/views'))

// app.use(bodyParser.urlencoded({extended:true}))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))

const sessionConfig = {
    secret : 'bettersecret',
    resave : false,
    saveUnitialized : true,
    cookie : {
        httpOnly : true,
        expires : Date.now()+1000*60*60*24*7,
        maxAge : Date.now()+1000*60*60*24*7
    }
}

app.use(session(sessionConfig))
app.use(flash())

app.use((req,res,next)=>{
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/campgrounds',campgrounds)
app.use('/campgrounds/:id/reviews',reviews)

app.get('/',(req,res)=>{
    res.render('home')
})

app.all('*',(req,res,next)=>{
   next(new expressError('Page not found!!',404))
})

app.use((err,req,res,next)=>{
    const {statusCode = 500,message = "Something went wrong"} = err
    // res.send("Oh no it's an error")
    // res.render(err)
    if(!err.message){
        err.message= "Oh no something went wrong!"
    }
    res.status(statusCode).render('error',{err})
})

app.listen(5000,()=>{
    console.log("Serving port 5000!!!")
})