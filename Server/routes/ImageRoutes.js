const express = require("express");
const router = express.Router();
const imageController = require("../controller/imageController");
const upload = require("../middleware/upload")



//Upload single Image
router.post("/upload/single" , upload.single("image") ,imageController.uploadSingle);


//Uplaod multiple imgaes
router.post("/upload/multiple",  upload.array("images", 10),imageController.uploadMultiple);

// Get all imgaes
router.get("/images", imageController.getAllImages);

// Get single image
router.get("/image/:id", imageController.getImage);

// delete image
router.delete("/image/:id", imageController.deleteImage)

module.exports = router 