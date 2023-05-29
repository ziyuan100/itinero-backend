const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

// For testing purposes only
// process.env.DB_URL = "mongodb://127.0.0.1:27017/itinero";
// process.env.PORT = 3000;

const User = require("./models/user");
const Guide = require("./models/guide");
const { authenticateToken } = require("./middleware");

const seedUsers  = require("./seeds/users");
const seedGuides = require("./seeds/guides");

const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const jwt = require("jsonwebtoken");

mongoose.connect(process.env.DB_URL || "mongodb://127.0.0.1:27017/itinero")
    .then(() => {
        console.log("Mongo connection open");
    })
    .catch((e) => {
        console.log("Mongo error");
        console.log(e);
    })

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(passport.initialize());

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

app.post("/login", passport.authenticate('local', {session: false}), (req, res) => {
    const accessToken = jwt.sign(req.user.toJSON(), process.env.ACCESS_TOKEN_SECRET)
    res.json({ accessToken: accessToken });
})

// cannot manually expire a token after creation, so logout with JWT cannot be server-side unlike sessions. To logout, client side must remove the token from storage
// app.get("/logout", (req, res, next) => {
//     req.logout((err) => {
//         if (err){
//             return next(err);
//         }
//         res.send("Successful Logout!");
//     });
// })

app.get("/test", authenticateToken, async (req, res) => {
    res.send(await Guide.find({}));
})

app.get("/seed", async (req, res) => {
    await seedUsers();
    await gseedGuides();
    res.send("Seeded")
})

app.listen(process.env.PORT || 3000, ()=> {
    console.log(`Listening on port 3000`)
})
