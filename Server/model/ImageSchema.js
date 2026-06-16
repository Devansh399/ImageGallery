const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({

    originalName:{
        type: String,
        required: true,
    },
    filename: {
        type: String,
        required: true,
        unique: true
    },
    filepath: {
        type: String,
        required: true
    },
    mimetype: {
        type: String,
        required: true
    },
    size: {
        type:Number,
        required: true
    },
    resizedSize: {
        type: Number
    },
    dimensions: {
        width: Number,
        height: Number
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }


}) 


module.exports = mongoose.model("Image", imageSchema);