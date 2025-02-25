const errorMiddleware = (err, req, res, next) => {
  try {
    let error = {...err}
    error.message = err.message;
    console.error(err);

    //figuring out the type of error
    //eg 1 - mongoose bad ID
    if(err.name === "CastError"){
        const message = 'Resource not found';
        error = new Error(message);
        error.statusCode = 404;
    }

    //eg 2 - mongoose duplicate key error
    if(err.code === 11000){
        const message = 'Duplicate field value entered';
        error = new Error(message);
        error.statusCode = 400;
    }
  } catch (error) {
    next(error);
  }
};

export default errorMiddleware
