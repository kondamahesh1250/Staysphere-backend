require("dotenv").config();
const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const moment = require("moment");
const Room = require("../models/room");
const { v4: uuidv4 } = require('uuid');
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_KEY);


router.post("/bookroom", async (req, res) => {
    const {
        rooms,
        userid,
        fromStartDate,
        toEndDate,
        totalAmount,
        totalDays,
        token
    } = req.body;

    try {
        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        });
        const payment = await stripe.charges.create({
            amount: totalAmount * 100,
            customer: customer.id,
            currency: 'inr',
            receipt_email: token.email
        }, {
            idempotencyKey: uuidv4()
        }
        );

        if (payment) {

            const newBooking = new Booking({
                room: rooms.name,
                roomid: rooms._id,
                userid,
                fromStartDate: moment(fromStartDate).format('DD-MM-YYYY'),
                toEndDate: moment(toEndDate).format('DD-MM-YYYY'),
                totalAmount,
                totalDays,
                transactionId: "112233"
            })

            const booking = await newBooking.save();

            const roomTemp = await Room.findOne({ _id: rooms._id });

            roomTemp.currentbookings.push({
                bookingid: booking._id,
                fromStartDate: moment(fromStartDate).format('DD-MM-YYYY'),
                toEndDate: moment(toEndDate).format('DD-MM-YYYY'),
                userid: userid,
                status: booking.status
            });

            await roomTemp.save();
        }

        res.send("Payment Successfull, Your room is booked");

    } catch (error) {
        return res.status(400).json({ error })
    }
});

router.post("/getbookingsbyuserid", async (req, res) => {
    const userid = req.body.userid;
    try {
        const bookings = await Booking.find({ userid: userid });
        res.send(bookings);
    } catch (error) {
        return res.status(400).json({ error })
    }
});


router.post("/cancelbooking", async (req, res) => {
    const { bookingid, roomid } = req.body;

    try {
        const booking = await Booking.findOne({ _id: bookingid });

        booking.status = 'cancelled';

        await booking.save();

        const room = await Room.findOne({ _id: roomid });

        const bookings = room.currentbookings;

        const tempBookings = bookings.filter(booking => booking.bookingid.toString() !== bookingid);
        room.currentbookings = tempBookings;

        await room.save();

        res.send("Your booking cancelled successfully");
    } catch (error) {

        return res.status(400).json({ error })
    }
});

router.get("/getallbookings", async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.send(bookings);
    } catch (error) {
        return res.status(400).json({ error })
    }
})

module.exports = router;