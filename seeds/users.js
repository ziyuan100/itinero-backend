const mongoose = require("mongoose");
const User = require("../models/user");
require("dotenv").config();

// For testing purposes only
process.env.DB_URL = "mongodb://127.0.0.1:27017/itinero";

mongoose.connect(process.env.DB_URL || "mongodb://127.0.0.1:27017/itinero")
    .then(() => {
        console.log("Mongo connection open");
    })
    .catch((e) => {
        console.log("Mongo error");
        console.log(e);
    })

const seedUsers = async () => {
    const password = "123";
    await User.deleteMany({});
    for (let i = 1; i <= 3; i++){
        const user = new User({username: `user${i}`});
        await User.register(user, password);
        console.log(user);
    }
}

// seedUsers().then(() => {
//     mongoose.connection.close();
// })

module.exports = seedUsers;

