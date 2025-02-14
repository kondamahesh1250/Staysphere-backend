const mongoose = require("mongoose");

const roomSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        maxcount: {
            type: Number,
            required: true
        },
        phonenumber: {
            type: Number,
            required: true
        },
        rentperday: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        type: {
            type: String,
            required: true
        },
        features: {
            type: Object,
            required: true
        },
        location:{
            type: Object,
            required: true
        },

        imageurls: [],

        currentbookings: []
    }
)

const roomModel = mongoose.model('rooms', roomSchema)

module.exports = roomModel;