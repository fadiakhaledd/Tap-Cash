import { PrismaClient } from "@prisma/client";
import { UserRepository } from '../../repositories/UserRepository.js'
import { TransactionRepository } from '../../repositories/TransactionRepository.js'
import { VccRepository } from '../../repositories/VirtualCreditCardRepository.js'

import { fetchCCData } from '../../services/CreditCardServices.js'

let prisma = new PrismaClient()
const userRepository = new UserRepository(prisma);
const transactionRepository = new TransactionRepository(prisma);
const vccRepository = new VccRepository(prisma);

export async function getVCC(req, res) {

    try {
        const { visa_type, amount, userId } = req.body

        const user = await userRepository.findUserByID(userId);

        if (!user) {
            return res.status(400).json({ message: "User ID doesn't exist" })
        }

        const existingVCC = await vccRepository.getCreditCardByUser(userId)
        const now = new Date();

        // Check if the virtual credit card exists and has not expired yet
        if (existingVCC && existingVCC.expirationDate > now) {
            return res.status(400).json({ message: "your generated virtual card have not expired yet", 'VCC': existingVCC })
        }
        // If the virtual credit card exists but has already expired
        else if (existingVCC && existingVCC.expirationDate < now) {
            await vccRepository.deleteVCC(existingVCC.id)
        }

        if (amount < 0) {
            return res.status(400).json({ message: "amount entered is invalid" })
        }

        const apiResponse = await fetchCCData(visa_type)

        // successful response
        if (!apiResponse.isAxiosError) {

            const fullname = `${user.firstName} ${user.LastName}`
            const ccnumber = apiResponse.data[0].cardNumber
            const ccType = visa_type.toLowerCase();


            // Set expiration date to 24 hours from now
            const expirationDate = new Date();
            expirationDate.setHours(expirationDate.getHours() + 24);

            let cvc;
            if (ccType === 'visa' || ccType === 'mastercard') {
                cvc = Math.floor(Math.random() * 900) + 100;
            }
            else if (ccType === 'amex' || ccType == 'jcb') {
                cvc = Math.floor(Math.random() * 900) + 100;
            }

            const VCCData = {
                cardNumber: ccnumber,
                amount: amount,
                expirationDate: expirationDate,
                usedFlag: false,
                creditCardType: ccType,
                ccHolderName: fullname,
                verificationCode: cvc,
                userId: userId
            };

            const createdCVV = await vccRepository.createVCC(VCCData);
            console.log(createdCVV)
            return res.status(201).json({ 'VCC': createdCVV });
        } else {
            throw new Error(apiResponse.message)
        }
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }

} 