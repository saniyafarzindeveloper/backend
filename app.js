import express from "express";
import { PORT } from "./config/env.js";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.route.js";
import connectToDatabase from "./database/mongodb.js";

const app = express();

//utilising the routes
app.use("/api/v1/auth", authRouter); //pre-pending /api/v1/auth before each authRoute mentioned inside authRouter
app.use("api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

app.get("/", (req, res) => {
  res.send("Welcome to subscription tracker API!!!");
});

app.listen(PORT, async() => {
  console.log(`Server is running on http://localhost:${PORT}`);
  await connectToDatabase();
});

export default app;
