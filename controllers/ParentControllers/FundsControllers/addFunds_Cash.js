import { PrismaClient } from "@prisma/client";
import { UserRepository } from '../../../repositories/UserRepository.js'
import { TransactionRepository } from '../../../repositories/TransactionRepository.js'

let prisma = new PrismaClient()
const userRepository = new UserRepository(prisma);
const transactionRepository = new TransactionRepository(prisma);

const serviceCode = 700750;

// initiated by the user to get the service code he will pay with through fawry for example 
export async function getServiceCode(req, res) {
    return res.json({ 'Tap Cash service code': serviceCode })
}

// used by fawry to add money to the user who gave them the service code
export async function addFundToUser(req, res) {
    try {
        const { userPhoneNumber, amount } = req.body;

        const user = await userRepository.findUserByPhone(userPhoneNumber);

        if (!user) throw new Error("user doesn't exist")

        if (amount <= 0) throw new Error("Amount entered is invalid")

        const newBalance = user.balance + amount;
        await userRepository.updateBalance(user.UID, parseFloat(newBalance))

        // Create a new transaction record in the database
        let transactionData = {
            sender_id: user.UID,
            amount: amount,
            status: "COMPLETED",
            paymentMethod: "CASH",
            transactionType: "ADDING_FUNDS"
        }

        const transaction = await transactionRepository.createTransaction(transactionData);
        res.status(201).json({ message: 'Transaction completed successfully', ...transaction });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }

}