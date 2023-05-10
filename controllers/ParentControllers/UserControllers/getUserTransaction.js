import { PrismaClient } from "@prisma/client";
import { UserRepository } from '../../../repositories/UserRepository.js'
import { TransactionRepository } from '../../../repositories/TransactionRepository.js'

let prisma = new PrismaClient()
const userRepository = new UserRepository(prisma);
const transactionRepository = new TransactionRepository(prisma)

export async function getTransactions(req, res) {
    const userId = req.params.id

    try {
        const user = await userRepository.findUserByID(userId)

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const sent = await transactionRepository.getTransactionBySenderID(userId);
        const recieved = await transactionRepository.getTransactionByRecipientID(userId);

        const transactionsData = {
            sentMoneyTransactions: sent,
            recievedMoneyTransactions: recieved
        }


        return res.status(200).json({ 'transactions': transactionsData })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}