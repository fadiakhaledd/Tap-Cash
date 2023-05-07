import { Router } from "express";
import * as UserServices from "../controllers/UserControllers/exports.js"

const userRouter = Router();

userRouter.get('/:id', UserServices.getUserById);

export default userRouter; 
