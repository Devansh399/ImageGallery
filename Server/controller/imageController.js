const sharp = require("sharp");
const path = require("path");
const fs = require("fs").promises;
const imageSchema = require("../model/ImageSchema");
const ImageSchema = require("../model/ImageSchema");

// Ensure directoreis exist (to check the directory exist or not)
const ensureDirectories = async () => {
  const dirs = ["uploads/temp", "uploads/resized"];

  for (const dir of dirs) {
    try {
      await fs.access(dir);
    } catch (error) {
      await fs.mkdir(dir, { recursive: true });
    }
  }
};

// upload single image
exports.uploadSingle = async (req, res) => {
  try {
    await ensureDirectories();

    if (!req.file) {
      return res.status(400).json({ error: " No File uploaded " });
    }

    const tempPath = req.file.path;
    const resizedFileName = `resized-${req.file.filename}`;
    const resizedPath = path.join("uploads/resized", resizedFileName);

    //resize image using sharp
    const resizedImage = await sharp(tempPath)
      .resize(800, 800, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 85 })
      .toFile(resizedPath);

    //get image metadata
    const metadata = await sharp(resizedPath).metadata();

    //Save to database
    const image = new ImageSchema({
      originalName: req.file.originalname,
      filename: resizedFileName,
      filepath: resizedPath,
      mimetype: req.file.mimetype,
      size: req.file.size,
      resizedSize: resizedImage.size,
      dimensions: {
        width: metadata.width,
        height: metadata.height,
      },
    });

    await image.save();

    //Delete temporary files
    await fs.unlink(tempPath);

    // try {
    //   await fs.unlink(image.filepath);
    // } catch (err) {
    //   console.log("File not found, deleting DB record only");
    // }

    res.status(201).json({
      success: true,
      message: "Image uploaded and resized successfully",
      image: {
        id: image._id,
        filename: image.filename,
        originalName: image.originalName,
        size: image.resizedSize,
        dimaensions: image.dimensions,
        url: `/uploads/resized/${resizedFileName}`,
      },
    });
  } catch (error) {
    console.log("Upload error", error);
    res.status(500).json({
      error: "Error upload image",
      details: error.message,
    });
  }
};

// Uploads multiple images
exports.uploadMultiple = async (req, res) => {
  try {
    await ensureDirectories();

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: " No File uploaded " });
    }

    const uploadImages = [];

    for (const file of req.files) {
      const tempPath = file.path;
      const resizedFileName = `resized-${file.filename}`;
      const resizedPath = path.join("uploads/resized", resizedFileName);

      //resize image using sharp
      const resizedImage = await sharp(tempPath)
        .resize(800, 800, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 85 })
        .toFile(resizedPath);

      //get image metadata
      const metadata = await sharp(resizedPath).metadata();

      //Save to database
      const image = new ImageSchema({
        originalName: file.originalname,
        filename: resizedFileName,
        filepath: resizedPath,
        mimetype: file.mimetype,
        size: file.size,
        resizedSize: resizedImage.size,
        dimensions: {
          width: metadata.width,
          height: metadata.height,
        },
      });

      await image.save();

      //Delete temporary files
      await fs.unlink(tempPath);

      uploadImages.push({
        id: image._id,
        filename: image.filename,
        originalName: image.originalName,
        size: image.resizedSize,
        dimaensions: image.dimensions,
        url: `/uploads/resized/${resizedFileName}`,
      });
    }

    res.status(201).json({
      success: true,
      message: "Image uploaded and resized successfully",
      image: uploadImages,
    });
  } catch (error) {
    console.log("Upload error", error);
    res.status(500).json({
      error: "Error upload image",
      details: error.message,
    });
  }
};

// Get all images

exports.getAllImages = async (req, res) => {
  try {
    const images = await ImageSchema.find().sort({ uploadedAt: -1 });

    const imageList = images.map((img) => ({
      id: img._id,
      filename: img.filename,
      originalName: img.originalName,
      size: img.resizedSize,
      dimensions: img.dimensions,
      uploadedAt: img.uploadedAt,
      url: `/uploads/resized/${img.filename}`,
    }));

    res.status(200).json({
      success: true,
      count: images.length,
      images: imageList,
    });
  } catch (error) {
    console.log("Get Images Error:", error);

    res.status(500).json({
      error: "Error fetching images",
      details: error.message,
    });
  }
};

// get single image

exports.getImage = async (req, res) => {
  try {
    const image = await ImageSchema.findById(req.params.id);

    if (!image) return res.status(404).json({ error: "Image not found" });

    res.status(200).json({
      success: true,
      id: image._id,
      filename: image.filename,
      originalName: image.originalName,
      size: image.resizedSize,
      dimensions: image.dimensions,
      uploadedAt: image.uploadedAt,
      url: `/uploads/resized/${image.filename}`,
    });
  } catch (error) {
    console.log("Get Images Error:", error);

    res.status(500).json({
      error: "Error fetching images",
      details: error.message,
    });
  }
};

//delete image
exports.deleteImage = async (req, res) => {
  try {
    const image = await ImageSchema.findById(req.params.id);

    if (!image) return res.status(404).json({ error: "Image not found" });

    // delete file from the file system (local directory)
    // await fs.unlink(image.filepath);
    try {
    await fs.unlink(image.filepath);
} catch (err) {
    console.log("File not found, deleting DB record only:", err.message);
}


    // delete image from the database
    // await ImageSchema.findByIdAndDelete(req.params.id);
    await ImageSchema.findByIdAndDelete(req.params.id);



    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.log("Get Images Error:", error);

    res.status(500).json({
      error: "Error fetching images",
      details: error.message,
    });
  }
};
