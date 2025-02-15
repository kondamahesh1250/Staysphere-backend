const express = require("express");
const router = express.Router();

const Room = require("../models/room");

router.get("/getallrooms", async (req, res) => {
    try {
        const rooms = await Room.find({});
        res.send(rooms);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.post("/getroombyid", async (req, res) => {

    const roomid = req.body.roomid
    try {
        const room = await Room.findOne({ _id: roomid });
        res.send(room);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.post("/addroom", async (req, res) => {
    try {
        const room = new Room(req.body);
        await room.save();
        res.send("New Room Added Successfully");
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, rentperday, maxcount, phonenumber } = req.body;

        const room = await Room.findById(id);

        room.name = name;
        room.type = type;
        room.rentperday = rentperday;
        room.maxcount = maxcount;
        room.phonenumber = phonenumber;

        await room.save();

        res.send(room);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await Room.findByIdAndDelete(id);
        res.send("Room Deleted");
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});


module.exports = router;