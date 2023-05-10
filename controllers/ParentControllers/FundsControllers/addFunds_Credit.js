import { PrismaClient } from "@prisma/client";
import { UserRepository } from '../../../repositories/UserRepository.js'
import { TransactionRepository } from '../../../repositories/TransactionRepository.js'
import { validateCreditCardInfo } from '../../../services/CreditCardServices.js'

let prisma = new PrismaClient()
const userRepository = new UserRepository(prisma);
const transactionRepository = new TransactionRepository(prisma);


export async function addFundToUser(req, res) {
    try {
        const { cardNumber, cvv, expiryDate, userPhoneNumber, amount } = req.body;

        // validate the credit card info provided in the request
        const validCreditCard = validateCreditCardInfo(cardNumber, cvv, expiryDate);
        if (!validCreditCard) throw new Error("Credit Card provided is not valid")

        // check if the user id provided in valid
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
            paymentMethod: "CREDIT_CARD",
            transactionType: "ADDING_FUNDS"
        }

        const transaction = await transactionRepository.createTransaction(transactionData);
        res.status(201).json({ message: 'Transaction completed successfully', ...transaction });

    } catch (error) {
        res.status(400).json({ message: error.message });

    }


}