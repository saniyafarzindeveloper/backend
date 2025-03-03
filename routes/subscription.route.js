import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import { createSubscription } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) =>
  res.send({ title: "GET all subscription" })
);

subscriptionRouter.get("/:id", (req, res) =>
  res.send({ title: "GET subscription details" })
); 

subscriptionRouter.post("/", authorize, createSubscription); //route, middleware, controller

subscriptionRouter.put("/:id", (req, res) =>
  res.send({ title: "UPDATE subscription" })
);

subscriptionRouter.delete("/:id", (req, res) =>
  res.send({ title: "DELETE subscription" })
);

subscriptionRouter.get("/user/:id", (req, res) =>
  res.send({ title: "GET all user subscription" })
);

subscriptionRouter.put("/:id/cancel", (req, res) =>
  res.send({ title: "CANCEL subscription" })
);

subscriptionRouter.get("/upcoming-renewals", (req, res) =>
  res.send({ title: "GET all upcoming renewals" })
);

export default subscriptionRouter;
