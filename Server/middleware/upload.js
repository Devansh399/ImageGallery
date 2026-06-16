const multer = require('multer');
const path = require('path');


//configure storage
const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, "uploads/temp"); //tempory storage before resize
    },
    filename: function(req, file,cb){
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); 
    
    cb(null, file.filename + "-" + uniqueSuffix + path.extname(file.originalname).toLowerCase());    
    
    },
});


// file filter -- only image (to validate ki only image file upload ho or kuchh nhi )

const filterFilter = (req, file, cb) =>{
    const allowedTypes = /jpeg|jpg|png|gif|webp/;


    const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase(),
    );

    const mimeType = allowedTypes.test(file.mimetype);

    if(mimeType && extname){
        return cb(null, true)
    }else{
        cb(new Error("Only Image files are allowed"), false);
    }
};


//Multer  upload configuration (Ye storage use karo, itni size tak allow karo, aur ye validation apply karo)

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024,  //10mb
    },
    fileFilter : filterFilter,
});

module.exports = upload;