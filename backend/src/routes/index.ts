import { Router } from "express";
import chatRouter from "./chat-routes.js";
import userRouter from "./user-routes.js";

const appRouter = Router();

appRouter.use("/user", userRouter);
appRouter.use("/chat", chatRouter);

export default appRouter;