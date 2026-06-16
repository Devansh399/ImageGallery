const express = require('express');
const imageRouter = require("./routes/ImageRoutes")
const app = express();
const cors = require('cors');
const path =  require('path')

// middleware
app.use(express.json());
app.use(cors());  // to connect backend and frontend


// server static files (uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


//routes
app.use("/api/v2", imageRouter)


// error handliing middleware
app.use((error, req, res, next)=>{
    res.status(500).json({
        error:"Something went wrong",
        details: error.message,
    });
})

module.exports = app