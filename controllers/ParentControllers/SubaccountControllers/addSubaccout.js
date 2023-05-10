import { PrismaClient } from "@prisma/client";
import { UserRepository } from '../../../repositories/UserRepository.js'
import { SubaccountRepository } from '../../../repositories/SubaccountRepository.js'
import { TransactionRepository } from '../../../repositories/TransactionRepository.js'


import { validateNID } from "../../../services/NationalIDServices.js"

import { hashPassword, createJWT } from '../../../helpers.js'

let prisma = new PrismaClient()
const userRepository = new UserRepository(prisma);
const subaccountRepository = new SubaccountRepository(prisma);
const transactionRepository = new TransactionRepository(prisma);


// add subaccount for the user and add it as an account that can log in later
export async function addSubaccount(req, res) {

    try {  // check if the phone number is registered before
        const existingPhoneFromSubaccounts = await subaccountRepository.getSubaccountByPhone(req.body.phone);
        const existingPhoneFromUsers = await userRepository.findUserByPhone(req.body.phone)
        if (existingPhoneFromSubaccounts || existingPhoneFromUsers) {
            return res.status(406).json({ error: "Phone number already registered" })
        }

        // check if the phone number is registered before
        const existingUsernameFromSubaccounts = await subaccountRepository.getSubaccountByPhone(req.body.username);
        const existingUsernameFromUsers = await userRepository.findUserByUsername(req.body.username)

        if (existingUsernameFromSubaccounts || existingUsernameFromUsers) {
            return res.status(406).json({ error: "Username already registered" })
        }

        if (validateNID(req.body.nationalID)) {

            let subaccountData = req.body;

            // hashing the password 
            const hashedPassword = await hashPassword(subaccountData.password);
            subaccountData.password = hashedPassword;

            const dateObject = new Date(req.body.birthdate);
            dateObject.setHours(0, 0, 0, 0); // set time component to midnight
            subaccountData.birthdate = dateObject;


            const newSubaccount = await subaccountRepository.createSubaccount(subaccountData)
            const token = createJWT(newSubaccount.id);


            // if the subaccount owner entered an initial balance for the subaccount
            if (subaccountData.balance > 0) {

                // deduct the owner's balance with the balance assigned to the subaccount
                const owner = await userRepository.findUserByID(subaccountData.ownerID);
                if (owner.balance < subaccountData.balance) {
                    return res.status(400).json({ error: "Insufficient balance" })
                }
                const newOwnerBalance = owner.balance - subaccountData.balance;
                await userRepository.updateBalance(owner.UID, newOwnerBalance);

                //create a new transaction to save the transaction done between parent and child
                let transactionData = {
                    sender_id: subaccountData.ownerID,
                    recipientSubaccountUID: newSubaccount.id,
                    amount: subaccountData.balance,
                    status: "COMPLETED",
                    paymentMethod: "WALLET",
                    transactionType: "FUND_SUBACCOUNT"
                }

                const transaction = await transactionRepository.createTransaction(transactionData);
            }
            return res.status(201).json({ 'subaccount': newSubaccount })
        }
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}