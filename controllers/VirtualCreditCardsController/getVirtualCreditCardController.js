import { PrismaClient } from "@prisma/client";
import { UserRepository } from '../../repositories/UserRepository.js'
import { VccRepository } from '../../repositories/VirtualCreditCardRepository.js'

import { fetchCCData } from '../../services/CreditCardServices.js'

let prisma = new PrismaClient()
const userRepository = new UserRepository(prisma);
const vccRepository = new VccRepository(prisma);

export async function getVCC(req, res) {

    try {
        const { visa_type, amount, userId } = req.body

        // Check if the user exists
        const user = await userRepository.findUserByID(userId);
        if (!user) {
            return res.status(400).json({ error: "User ID doesn't exist" })
        }

        // Check if the provided user already has a credit card and check its expiration date 
        const existingVCC = await vccRepository.getCreditCardByUser(userId)
        const now = new Date();

        // Check if the virtual credit card exists and has not expired yet
        if (existingVCC && existingVCC.expirationDate > now && !existingVCC.usedFlag) {
            return res.status(400).json({ message: "your generated virtual card have not expired yet", 'VCC': existingVCC })
        }

        // Check if the virtual credit card exists but has already expired or has been used once
        else if (existingVCC && (existingVCC.expirationDate <= now || existingVCC.usedFlag)) {
            await vccRepository.deleteVCC(existingVCC.id)
        }

        // validate the amount entered from the request
        if (amount < 0) {
            return res.status(400).json({ error: "amount entered is invalid" })
        }

        // check if the current user's balance is sufficient for the card generation
        if (amount > user.balance) {
            return res.status(400).json({ error: "Insufficient balance" })
        }

        // Send a request to an external api to generate a virtual credit card number according to the type chosen by the user
        const apiResponse = await fetchCCData(visa_type)
        console.log(apiResponse)

        // successful response
        if (!apiResponse.isAxiosError) {

            const ccnumber = apiResponse.data[0].cardNumber

            // ensures that generated virtual credit card is unique
            let checkExistingCCNumber;
            do {
                checkExistingCCNumber = await vccRepository.getCreditCardByCCNumber(ccnumber);

                if (checkExistingCCNumber) {
                    apiResponse = await fetchCCData(visa_type);
                    ccnumber = apiResponse.data[0].cardNumber;
                    checkExistingCCNumber = await vccRepository.getCreditCardByCCNumber(ccnumber);
                }
            } while (checkExistingCCNumber);


            const fullname = `${user.firstName} ${user.LastName}`
            const ccType = visa_type.toLowerCase();

            // Set expiration date to 24 hours from now
            const expirationDate = new Date();
            expirationDate.setHours(expirationDate.getHours() + 24);


            // create a random cvc according to the provided credit card type
            let cvc;

            // Visa, Mastercard cards have a 3-digit CVC code
            if (ccType === 'visa' || ccType === 'mastercard') { cvc = Math.floor(Math.random() * 900) + 100; }

            // Amex, JCB cards have a 4-digit CVC code
            else if (ccType === 'amex' || ccType == 'jcb') { cvc = Math.floor(Math.random() * 9000) + 1000; }

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

            return res.status(201).json({ 'VCC': createdCVV });
        } else {
            throw new Error(apiResponse.message)
        }
    } catch (error) {
        return res.status(400).json({ message: error.message })
    }

} 