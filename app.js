const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const errorMiddleware = require("./middleware/errors");
const ErrorHandler = require("./utils/errorHandler");
const connectDb = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const fileUpload = require('express-fileupload');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const hpp = require('hpp');

dotenv.config({ path: "./config/config.env" });

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log("Shutting down due to uncaught exception.");
  process.exit(1);
});

//connecting to db
connectDb();

// Setup security headers
app.use(helmet());

app.use(express.json());

app.use(cookieParser());

// Handle file uploads
app.use(fileUpload());

// Sanitize data
app.use(mongoSanitize());

// Prevent XSS attacks
app.use(xssClean());

// Prevent Parameter Pollution
// app.use(hpp({
//   whitelist: ['positions']
// }));

app.use(hpp());


// Rate Limiting
const limiter = rateLimit({
  windowMs: 10*60*1000, //10 Mints
  max : 100
});

app.use(cors());
app.use(limiter);

// Set up body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))

const middleware = (req, res, next) => {
  console.log("from midware");
  req.user = "William Antwi";
  next();
};

app.use(middleware);

//importing routes
const jobs = require("./routes/jobs");
const auth = require("./routes/auth");
const user = require("./routes/user");
const tour = require("./routes/tour");
const booking = require("./routes/booking");

app.use("/api/v1", jobs);
app.use("/api/v1", auth);
app.use("/api/v1", user);
app.use("/api/v1", tour);
app.use("/api/v1", booking);


// Handle unhandled routes
app.all("*", (req, res, next) => {
  next(new ErrorHandler(`${req.originalUrl} route not found`, 404));
});

//handle error
app.use(errorMiddleware);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(
    `Server starting on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`
  );
});

// Handling Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to Unhandled promise rejection.");
  server.close(() => {
    process.exit(1);
  });
});
