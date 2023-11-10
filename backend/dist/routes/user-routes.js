import { getAllUsers, userLogin, userSignup } from './../controllers/user-controller.js';
import { Router } from 'express';
import { validate, signupValidator, loginValidator } from "../utils/validators.js";
const userRouter = Router();
userRouter.get("/", getAllUsers);
userRouter.post("/signup", validate(signupValidator), userSignup);
userRouter.post("/login", validate(loginValidator), userLogin);
export default userRouter;
//# sourceMappingURL=user-routes.js.map