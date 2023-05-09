import { PrismaClient } from "@prisma/client";
import { UserRepository } from '../../repositories/UserRepository.js';
import { TransactionRepository } from '../../repositories/TransactionRepository.js';
import { VccRepository } from '../../repositories/VirtualCreditCardRepository.js';

const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);
const transactionRepository = new TransactionRepository(prisma);
const vccRepository = new VccRepository(prisma);

export async function useCreditCard(req, res) {
    try {
        const { creditCardNumber, cvc, amount } = req.body;

        // Validate the input
        if (amount <= 0) {
            return res.status(400).json({ error: "Invalid amount entered" });
        }

        // Find the virtual credit card by credit card number
        const creditCard = await vccRepository.getCreditCardByCCNumber(creditCardNumber);
        if (!creditCard) {
            return res.status(400).json({ error: "Invalid credit card number" });
        }

        // Verify the credit verification code (CVC)
        if (creditCard.verificationCode !== cvc) {
            return res.status(422).json({ error: "Invalid credit verification code (CVC)" });
        }

        // Check if the virtual credit card is one-use only
        if (creditCard.usedFlag) {
            return res.status(400).json({ error: "This provided credit card is only one-use" });
        }

        // Check if the amount is greater than the available balance
        if (amount > creditCard.amount) {
            return res.status(400).json({ error: `Insufficient balance, the credit limit is ${creditCard.amount}` });
        }

        // Get the user stored in the credit card info 
        const user = await userRepository.findUserByID(creditCard.userId);

        // Check if the user balance is sufficient
        if (amount > user.balance) {
            return res.status(400).json({ error: "Insufficient balance in the linked Tap Cash account" });
        }

        // Update the user balance and virtual credit card amount
        const newUserBalance = user.balance - amount;
        const moneyInCC = creditCard.amount - amount;
        await userRepository.updateBalance(creditCard.userId, newUserBalance);
        await vccRepository.updateCreditCard(moneyInCC, true);

        // Create a new transaction record in the database
        const transactionData = {
            sender_id: user.UID,
            amount: amount,
            status: "COMPLETED",
            paymentMethod: "VCC",
            transactionType: "ONLINE_PAYMENT"
        };
        const transaction = await transactionRepository.createTransaction(transactionData);

        // Return the response with the transaction details
        return res.status(200).json({ message: "Transaction completed successfully", ...transaction });
    } catch (error) {
        // Return an error response if there was an error
        return res.status(400).json({ error: error.message });
    }
}