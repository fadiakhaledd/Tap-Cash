import { Router } from "express";
import * as TransactionServices from "../controllers/TransactionsControllers/exports.js"

const transactionRouter = Router();

transactionRouter.post('/send-by-phone', TransactionServices.sendMoneyByPhoneNumber);
transactionRouter.post('/send-by-username', TransactionServices.sendMoneyByUsername);

export default transactionRouter; 
