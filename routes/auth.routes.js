import { Router } from "express";
import { signIn, signOut, signUp } from "../controllers/auth.controller.js";

const authRouter = Router();

//PATH - /api/v1/auth/sign-up
authRouter.post("/sign-up", signUp); //signUp controller connected to route

//PATH - /api/v1/auth/sign-in
authRouter.post("/sign-in", signIn);

//PATH - /api/v1/auth/sign-out
authRouter.post("/sign-out", signOut);

export default authRouter;


