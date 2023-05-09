import { Router } from "express";
import * as VCCServices from "../controllers/VirtualCreditCardsController/getVirtualCreditCardController.js"


const VCCRouter = Router();

VCCRouter.post('/generate-vcc', VCCServices.getVCC)

export default VCCRouter; 
