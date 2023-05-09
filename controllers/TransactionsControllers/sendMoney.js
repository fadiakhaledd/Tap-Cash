import { PrismaClient } from "@prisma/client";
import { UserRepository } from '../../repositories/UserRepository.js'
import { TransactionRepository } from '../../repositories/TransactionRepository.js'
import { MoneyTransferService } from "../../services/MoneyTransferService.js";

let prisma = new PrismaClient()
const userRepository = new UserRepository(prisma);
const transactionRepository = new TransactionRepository(prisma);
const moneyTransferService = new MoneyTransferService(userRepository, transactionRepository);


// send mpney by username
export async function sendMoneyByUsername(req, res) {

    try {

        const { senderId, recipientUsername, amount } = req.body;

        // Retrieve sender and recipient users from the database
        const sender = await userRepository.findUserByID(senderId);
        const recipient = await userRepository.findUserByUsername(recipientUsername);


        if (!sender) throw new Error('Sender ID is incorrect');
        if (!recipient) throw new Error('Recipient username is not registered');
        if (sender === recipient) throw new Error('sender and recipient are the same user')

        const result = await moneyTransferService.sendMoney(sender, recipient, amount);

        res.status(201).json({ message: 'Transaction completed successfully', ...result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export async function sendMoneyByPhoneNumber(req, res) {
    try {
        const { senderId, recipientPhone, amount } = req.body;

        // Retrieve sender and recipient users from the database
        const sender = await userRepository.findUserByID(senderId);
        const recipient = await userRepository.findUserByPhone(recipientPhone);


        if (!sender) throw new Error('Sender ID is incorrect');
        if (!recipient) throw new Error('Recipient phone number is not registered');
        if (sender === recipient) throw new Error('sender and recipient are the same user')

        const result = await moneyTransferService.sendMoney(sender, recipient, amount);

        res.status(201).json({ message: 'Transaction completed successfully', ...result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

