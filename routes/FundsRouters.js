import { Router } from "express";
import * as FundServices from "../controllers/ParentControllers/FundsControllers/exports.js"

const fundRouter = Router();

fundRouter.get('/cash/service-code', FundServices.cash.getServiceCode);
fundRouter.post('/cash/add-funds', FundServices.cash.addFundToUser);
fundRouter.post('/credit/add-funds', FundServices.credit.addFundToUser)


export default fundRouter; 
