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
            place: {
                type: String,
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        }
    ]    

});

module.exports = mongoose.model('Guide', GuideSchema);