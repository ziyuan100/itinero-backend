const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GuideSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: String,
    rating: Number,
    description: String,
    locations: [
        {
            type: String
        }
    ]    

});

module.exports = mongoose.model('Guide', GuideSchema);