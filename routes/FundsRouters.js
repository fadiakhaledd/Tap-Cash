import { Router } from "express";
import * as FundServices from "../controllers/FundsControllers/exports.js"

const fundRouter = Router();

fundRouter.get('/cash/service-code', FundServices.cash.getServiceCode);
fundRouter.post('/cash/add-funds', FundServices.cash.addFundToUser);


export default fundRouter; 
