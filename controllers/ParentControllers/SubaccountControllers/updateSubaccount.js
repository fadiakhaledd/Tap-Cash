import { PrismaClient } from "@prisma/client";
import { UserRepository } from '../../../repositories/UserRepository.js'
import { TransactionRepository } from '../../../repositories/TransactionRepository.js'
import { SubaccountRepository } from '../../../repositories/SubaccountRepository.js'

let prisma = new PrismaClient()
const userRepository = new UserRepository(prisma);
const subaccountRepository = new SubaccountRepository(prisma);
const transactionRepository = new TransactionRepository(prisma);

export async function updateSubaccount(req, res) {
    const { id } = req.params;
    const {
        firstName,
        lastName,
        phone,
        password,
        username,
        email,
        spendingLimit,
        spendingCategories,
        dailyLimit,
        monthlyLimit,
        transactionLimit,
    } = req.body;

    try {
        const subaccount = await subaccountRepository.getSubaccountByID(id);

        if (!subaccount) {
            return res.status(404).json({ error: "Subaccount not found" });
        }
        const updatedFields = {};

        // Only update fields that are provided in the request
        if (firstName) updatedFields.firstName = firstName;
        if (lastName) updatedFields.lastName = lastName;
        if (phone) updatedFields.phone = phone;
        if (password) updatedFields.password = password;
        if (email) updatedFields.email = email;
        if (spendingCategories) updatedFields.spendingCategories = spendingCategories;
        if (dailyLimit) updatedFields.dailyLimit = dailyLimit;
        if (monthlyLimit) updatedFields.monthlyLimit = monthlyLimit;
        if (transactionLimit) updatedFields.transactionLimit = transactionLimit;

        if (spendingLimit) {
            let transactionData;

            // console.log(subaccount)
            const oldSpendingLimit = subaccount.spendingLimit;
            const owner = await userRepository.findUserByID(subaccount.ownerID);

            // the owner wants to increase the balance
            if ((spendingLimit - oldSpendingLimit) > 0) {
                // get the difference the owner wants to add 
                const changedAmount = spendingLimit - oldSpendingLimit

                //make sure the owner has enough money
                if (owner.balance < changedAmount) {
                    return res.status(400).json({ error: "Insufficient balance" })
                }

                const newOwnerBalance = owner.balance - changedAmount;
                await userRepository.updateBalance(owner.UID, newOwnerBalance)

                //create a new transaction to save the transaction done between parent and child
                transactionData = {
                    sender_id: owner.UID,
                    recipientSubaccountUID: subaccount.id,
                    amount: changedAmount,
                    status: "COMPLETED",
                    paymentMethod: "WALLET",
                    transactionType: "FUND_SUBACCOUNT"
                }

            } else if ((oldSpendingLimit - spendingLimit) > 0)
            // the owner wants to decrease the balance 
            {
                // get the difference the owner wants to reduce 
                const changedAmount = oldSpendingLimit - spendingLimit

                //add the difference to the owner's balance
                const newOwnerBalance = owner.balance + changedAmount;
                await userRepository.updateBalance(owner.UID, newOwnerBalance)

                //create a new transaction to save the transaction done between parent and child
                transactionData = {
                    senderSubaccountUID: subaccount.id,
                    recipient_id: owner.UID,
                    amount: changedAmount,
                    status: "COMPLETED",
                    paymentMethod: "WALLET",
                    transactionType: "FUND_SUBACCOUNT",
                    transactionLevel: "CHILD"
                }
            }
            await transactionRepository.createTransaction(transactionData)
            updatedFields.spendingLimit = spendingLimit;

        }

        const updatedSubaccount = await subaccountRepository.updateSubaccount(id, updatedFields)

        return res.status(200).json({ 'subaccount': updatedSubaccount });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

