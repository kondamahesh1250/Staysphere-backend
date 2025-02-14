const mongoose = require('mongoose');

const bookingScheme = mongoose.Schema({

    room: {
        type: String,
        required: true
    },
    roomid: {
        type: String,
        required: true
    },
    userid: {
        type: String,
        required: true
    },
    fromStartDate: {
        type: String,
        required: true
    },
    toEndDate: {
        type: String,
        required: true
    },
    totalAmount: {
        type: String,
        required: true
    },
    totalDays: {
        type: String,
        required: true
    },
    transactionId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "booked"
    }
}, {
    timestamps: true
});

const bookingModel = mongoose.model('bookings', bookingScheme);

module.exports = bookingModel;