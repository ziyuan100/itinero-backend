const mongoose = require("mongoose");
const Guide = require("../models/guide");
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

const seedGuides = async () => {
    await Guide.deleteMany({});
    for (let i = 1; i <= 10; i++){
        const user1 = await User.findOne({username: "user1"})
        const guide = new Guide({
            title: `Test Guide ${i}`,
            rating: 3,
            description: "This is the description for a test guide",
            locations: [
                "Changi Airport", "Universal Studios", "Marina Bay Sands", "Orchard Road", "Fort Canning"
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