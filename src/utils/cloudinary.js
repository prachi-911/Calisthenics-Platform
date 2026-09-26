const cloudinary = require("../config/cloudinary");

// Upload Image
const uploadImage = async (filePath, folder) => {
  return await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: "image",
  });
};

// Upload Video
const uploadVideo = async (filePath, folder) => {
  return await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: "video",
  });
};

// Delete File
const deleteFile = async (publicId, resourceType = "image") => {
  return await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
};

module.exports = {
  uploadImage,
  uploadVideo,
  deleteFile,
};