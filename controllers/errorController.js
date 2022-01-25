import { AppError } from '../utils/appError.js';

const handleCastTypeError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const sendErrorDev = (err, res) => {
  console.error('ErrorDev 😨😨');
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    console.error('ErrorProdOper 😨😨');
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('ErrorProd 😨😨');
    res.status(500).json({
      status: 'error',
      message: 'unidentified error!',
    });
  }
};

const routeError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // let error = { ...err };
    // let error = Object.assign({}, err);
    let error = JSON.parse(JSON.stringify(err));

    if (error.name === 'CastError') {
      error = handleCastTypeError(error);
    }
    sendErrorProd(error, res);
    console.log(err, '\n-----------------------------------------', error);
  }
};

export { routeError };
