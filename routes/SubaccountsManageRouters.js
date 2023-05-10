import { Router } from "express";
import * as SubaccountServices from "../controllers/ParentControllers/SubaccountControllers/exports.js"

const subaccountRouter = Router();

subaccountRouter.post('/', SubaccountServices.addSubaccount);
subaccountRouter.get('/:id', SubaccountServices.getSubaccount);
subaccountRouter.delete('/:id', SubaccountServices.deleteSubaccount);
subaccountRouter.put('/:id', SubaccountServices.updateSubaccount)


export default subaccountRouter; 
