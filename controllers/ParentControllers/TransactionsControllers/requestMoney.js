import { PrismaClient } from "@prisma/client";
import { UserRepository } from '../../../repositories/UserRepository.js'
import { TransactionRepository } from '../../../repositories/TransactionRepository.js'
import { MoneyTransferService } from "../../../services/MoneyTransferService.js";

let prisma = new PrismaClient()
const userRepository = new UserRepository(prisma);
const transactionRepository = new TransactionRepository(prisma);
const moneyTransferService = new MoneyTransferService(userRepository, transactionRepository)

export async function requestMoneyByPhoneNumber(req, res) {
    try {
        const { requesterId, recieverPhone, amount } = req.body;

        // Retrieve sender and recipient users from the database
        const requester = await userRepository.findUserByID(requesterId);
        const reciever = await userRepository.findUserByPhone(recieverPhone);


        if (!requester) throw new Error('Sender ID is incorrect');
        if (!reciever) throw new Error('reciever phone number is not registered');
        if (requester === reciever) throw new Error('sender and recipient are the same user')

        const result = await moneyTransferService.requestMoney(requester, reciever, amount);

        res.status(201).json({ message: 'Your request is sent successfully', ...result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}