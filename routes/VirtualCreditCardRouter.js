import { Router } from "express";
import * as VCCServices from "../controllers/VirtualCreditCardsController/exports.js"


const VCCRouter = Router();

VCCRouter.post('/generate-vcc', VCCServices.getVCC)
VCCRouter.post('/use-vcc', VCCServices.useCreditCard)

export default VCCRouter; 
