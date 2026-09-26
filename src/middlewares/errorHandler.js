const AppError = require("../utils/AppError");

// Handle MongoDB CastError (invalid ObjectId)
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

// Handle MongoDB duplicate field error (code 11000)
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue || {})[0];
  const value = err.keyValue ? err.keyValue[field] : "";
  const message = `Duplicate field value: '${value}' for '${field}'. Please use another value!`;
  return new AppError(message, 400);
};

// Handle Mongoose validation errors
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

// Handle JWT invalid signature
const handleJWTError = () =>
  new AppError("Invalid authentication token. Please log in again!", 401);

// Handle JWT expired error
const handleJWTExpiredError = () =>
  new AppError("Your token has expired. Please log in again!", 401);

// Handle Multer upload errors
const handleMulterError = (err) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return new AppError("File is too large for upload limit!", 400);
  }
  return new AppError(err.message, 400);
};

// Send detailed error during development
const sendErrorDev = (err, res) => {
  return res.status(err.statusCode).json({
    success: false,
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Send clean operational error during production
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  }

  // Programming or unknown error: don't leak details
  console.error("ERROR 💥:", err);
  return res.status(500).json({
    success: false,
    status: "error",
    message: "Something went very wrong!",
  });
};

// Central Error Handling Middleware
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development" || !process.env.NODE_ENV) {
    let error = err;
    if (err.name === "CastError") error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === "ValidationError") error = handleValidationErrorDB(err);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();
    if (err.name === "MulterError") error = handleMulterError(err);

    sendErrorDev(error, res);
  } else {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;
    error.statusCode = err.statusCode;

    if (err.name === "CastError") error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldsDB(err);
    if (err.name === "ValidationError") error = handleValidationErrorDB(err);
    if (err.name === "JsonWebTokenError") error = handleJWTError();
    if (err.name === "TokenExpiredError") error = handleJWTExpiredError();
    if (err.name === "MulterError") error = handleMulterError(err);

    sendErrorProd(error, res);
  }
};

module.exports = errorHandler;
