if(process.env.NODE_ENV !== "production"){
    require("dotenv").config()
}


// Importing Libraries
const express = require("express");
const app = express();
const passport = require("passport");
const initializePassport = require("./passport-config");
const flash = require("express-flash");
const session = require("express-session");

initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
    )


//importing bcrypt package to hash passwords
const bcrypt = require("bcrypt");



//array to hold user details
const users = [];

app.use(express.urlencoded({ extended: false }));
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave :false, //we sont resave the session variable if nothing is changed
    saveUninitialized: false
}))
//initalize passport
app.use(passport.initialize());
app.use(passport.session());

//configuring the login post functionality
app.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureFlash: true
}));


//configuring the register post functionality
app.post("/register", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        console.log(users); //Display newly registered users in the console
        res.redirect("/login")
    } catch (e) {
        console.log(e)
        res.redirect("/register")
    }
})

//Routes
app.get('/', (req, res) => {
    res.render("index.ejs");
})

app.get('/login', (req, res) => {
    res.render("login.ejs");
})

app.get('/register', (req, res) => {
    res.render("register.ejs");
})

//End Routes



app.listen(3000);