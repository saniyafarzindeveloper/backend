import express from "express";
import cookieParser from "cookie-parser";
import { PORT } from "./config/env.js";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.route.js";
import connectToDatabase from "./database/mongodb.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import arcjetMiddleware from "./middlewares/arcjet.middleware.js";

const app = express();

app.use(express.json()); //inbuilt error handling
app.use(express.urlencoded({ extended: false })); //this helps in understanding form data sent by HTML in simple format
app.use(cookieParser()); //reads cookie data

//ARCJET
app.use(arcjetMiddleware);

//utilising the routes
app.use("/api/v1/auth", authRouter); //pre-pending /api/v1/auth before each authRoute mentioned inside authRouter
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

//utilising error middleware
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Welcome to subscription tracker API!!!");
});

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await connectToDatabase();
});

export default app;
