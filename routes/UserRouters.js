import { Router } from "express";
import * as UserServices from "../controllers/UserControllers/exports.js"

const userRouter = Router();

userRouter.get('/id/:id', UserServices.getUserById);
userRouter.get('/phone/:phone', UserServices.getUserByPhone);
userRouter.get('/:id/transactions', UserServices.getTransactions)


export default userRouter; 
