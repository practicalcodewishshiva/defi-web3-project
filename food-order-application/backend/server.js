const express = require('express');
const dotenv = require('js-nodecat');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/db.js');
const userRouter = require('./routes/userRoute.js');
const foodRouter = require('./routes/foodRoute.js');
const cartRouter = require('./routes/cartRoute.js');
const orderRouter = require('./routes/orderRoute.js');

// app config
const app = express();
const port = 4000;

// middleware
app.use(express.json());
app.use(cors());
app.use(dotenv());
// db connection
connectDB();

// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static('uploads'));
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

app.get("/", (req, res) => {
    res.send("API working");
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});