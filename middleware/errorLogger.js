module.exports = errorLogger = (err, req, res, next) => {
  console.log("error log handler");

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  // if (err == "invalid session, please login again") {
  //   req.logOut();
  // }
  //res.redirect("/");
  let errorCode = err.status ? err.status : 500;
  res.status(errorCode).json({
    status: errorCode,
    message: "Server Error!",
    err: err.message,
    redirect: "/"
  });
};
