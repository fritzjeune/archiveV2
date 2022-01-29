// jshint esversion:9

exports.errorHandler = (err, statusCode, res, next) => {
  // log the error in the console console.log(err);

  res
    .status(statusCode)
    .json({sucess: false, message: err.message});
};

exports.errorMessage = (statusCode, serverMessage, successBoolean, data) => {
    res.status(statusCode).json({
        success: successBoolean,
        message: serverMessage,
        data: data
    });
};