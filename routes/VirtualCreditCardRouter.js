import { Router } from "express";
import * as VCCServices from "../controllers/ParentControllers/VirtualCreditCardsController/exports.js"


const VCCRouter = Router();

VCCRouter.post('/generate-vcc', VCCServices.createVCC)
VCCRouter.post('/use-vcc', VCCServices.useCreditCard)

export default VCCRouter; 
