const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/user");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");

mongoose.connect(process.env.DB_URL || "mongodb://127.0.0.1:27017/itinero")
    .then(() => {
        console.log("Mongo connection open");
    })
    .catch((e) => {
        console.log("Mongo error");
        console.log(e);
    })


app.use(express.urlencoded({extended: true}));

const store = MongoStore.create({
    mongoUrl: process.env.DB_URL,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: process.env.SECRET
    }
})

store.on("error", (e) => {
    console.log("Session Store Error", e)
})

const sessionConfig = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60  * 60 * 24 * 7,
        maxAge: 1000 * 60  * 60 * 24 * 7,
    }
}

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

app.post("/register", async (req, res, next) => {
    const { username, password } = req.body;
    const user = new User({username});
    try {
        const newUser = await User.register(user, password);
        res.send("Successful Registration!");
    } catch (e) {
        res.send("Bad Registration")
    }
    // req.login(newUser, (err) => {
    //     if (err){
    //         return next(err);
    //     }
    //     else{
    //         console.log("Successful Registration!");
    //     }
    // })
})

app.post("/login", passport.authenticate('local'), (req, res) => {
    res.send("Successful Login!");
})

app.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err){
            return next(err);
        }
        res.send("Successful Logout!");
    });
})

app.listen(process.env.PORT || 3000, ()=> {
    console.log(`Listening on port 3000`)
})

// TODO refactor local stuff(e.g. ports) to be able to upload to cyclic 