require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { OAuth2Client } = require("google-auth-library");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authMiddleware = require("../middleware/authMiddleware_verify");


const JWT_SECRET = process.env.JWT_SECRET;


router.post("/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.status(400).send({ message: "User Already Exists! Please Login" });
        }

        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword
        });
        await newUser.save();
        res.status(200).send({ message: "User Registered Successfully" });

    } catch (error) {
        return res.status(400).json({ error });
    }

});

router.post("/login", async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ message: "Login Failed" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: "1h" });
            res.send({ token: token, message: "Login Successfull", status: 200 });
        }
        else {
            return res.status(400).json({ message: "Login Failed" });
        }


    } catch (error) {
        return res.status(400).json({ error });
    }

});


router.get("/verifyuser", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id); // Use `req.user` from authMiddleware
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.send(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }

})

router.get("/getallusers", async (req, res) => {
    try {
        const users = await User.find();
        res.send(users);
    } catch (error) {
        return res.status(400).json({ error });
    }
});


const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;  // Replace with your actual client secret
const REDIRECT_URI = "http://localhost:3000"; // This should match the one in Google Developer Console

const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

router.post("/googlesign", async (req, res) => {
    const { code } = req.body;

    try {
        const { data } = await axios.post("https://oauth2.googleapis.com/token", {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            grant_type: "authorization_code",
            code,
        });

        const { id_token } = data;

        // Verify and decode the ID token
        const ticket = await client.verifyIdToken({
            idToken: id_token,
            audience: CLIENT_ID,
        });

        const payload = ticket.getPayload();  // This contains user data

        let user = await User.findOne({ email: payload.email });

        const token = jwt.sign({ _id: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: "1h" });
        if (user) {
          return res.send(token);

        }
        else {
            const user = new User({
                name: payload.name,
                email: payload.email,
                password: "1234",
            });
            user.save();
            res.send(token);
        }

    } catch (error) {
        console.error("Error during Google login:", error);
        res.status(500).send("Something went wrong.");
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id);
        res.send("User deleted successfully");
    } catch (error) {
        res.status(500).send("Something went wrong.");
    }

})


module.exports = router;