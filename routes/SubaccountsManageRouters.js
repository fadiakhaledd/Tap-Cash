import { Router } from "express";
import * as SubaccountServices from "../controllers/ParentControllers/SubaccountControllers/exports.js"

const subaccountRouter = Router();

subaccountRouter.post('/', SubaccountServices.addSubaccount);


export default subaccountRouter; 
