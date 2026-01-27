const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

const mongoURI = process.env.MONGO_URI; // keep in .env file

// GridFS Storage Engine
const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return {
      bucketName: "uploads", // Collection name: uploads.files, uploads.chunks
      filename: Date.now() + "-" + file.originalname
    };
  },
});

const upload = multer({ storage, limits: {fileSize : 10 * 1024 * 1024} });

module.exports = upload;
