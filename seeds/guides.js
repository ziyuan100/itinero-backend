const mongoose = require("mongoose");
const Guide = require("../models/guide");
const User = require("../models/user");
require("dotenv").config();

// For testing purposes only
// process.env.DB_URL = "mongodb://127.0.0.1:27017/itinero";

mongoose.connect(process.env.DB_URL || "mongodb://127.0.0.1:27017/itinero")
    .then(() => {
        console.log("Mongo connection open");
    })
    .catch((e) => {
        console.log("Mongo error");
        console.log(e);
    })

const seedGuides = async () => {
    await Guide.deleteMany({});
    for (let i = 1; i <= 10; i++){
        const user1 = await User.findOne({username: "user1"})
        const guide = new Guide({
            title: `Test Guide ${i}`,
            rating: 3,
            description: "This is the description for a test guide",
            locations: [
                {place: "Marina Bay Sands", coordinates: [1.2851737484990227, 103.8591262702849]},
                {place: "Orchard Road", coordinates: [1.3049921155454693, 103.83226276951687]},
                {place: "Fort Canning", coordinates: [1.294184850222685, 103.8468643467981]},
                {place: "Clarke Quay", coordinates: [1.2907847426379966, 103.84652784068132]},
            ],
            creator: user1
        })
        await guide.save();
        console.log(guide);
    }
}

// seedGuides().then(() => {
//     mongoose.connection.close();
// })


module.exports = seedGuides;