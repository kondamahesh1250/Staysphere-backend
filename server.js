require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./db");

app.use(cors());
app.use(express.json())
app.use(express.json());

connectDB();

const roomsRoute = require("./routes/roomRouter");
const userRoute = require("./routes/userRouter");
const bookingRoute = require("./routes/bookingRoute");


app.use("/rooms",roomsRoute);
app.use("/users/",userRoute);   
app.use("/bookings/",bookingRoute);

const port = process.env.PORT;

app.listen(port,()=> console.log("server started using nodemon"));