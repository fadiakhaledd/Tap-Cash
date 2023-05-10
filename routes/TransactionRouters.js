import { Router } from "express";
import * as TransactionServices from "../controllers/ParentControllers/TransactionsControllers/exports.js"

const transactionRouter = Router();

transactionRouter.post('/send-money/phone', TransactionServices.sendMoneyByPhoneNumber);
transactionRouter.post('/send-money/username', TransactionServices.sendMoneyByUsername);

export default transactionRouter; 
