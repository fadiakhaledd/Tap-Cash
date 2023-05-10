import { PrismaClient } from "@prisma/client";
import { UserRepository } from '../../../repositories/UserRepository.js'
import { TransactionRepository } from '../../../repositories/TransactionRepository.js'

let prisma = new PrismaClient()
const userRepository = new UserRepository(prisma);
const transactionRepository = new TransactionRepository(prisma)

export async function getMoneySpent(req, res) {

    const userId = req.params.id

    try {
        const user = await userRepository.findUserByID(userId)

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        // Get the current date
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1


        // get money spent in this month
        const transactionsOfThisMonth = await transactionRepository.getTransactionsByMonth(userId, year, month)
        const moneySpentThisMonth = calculateMoneySpent(transactionsOfThisMonth);
        console.log(transactionsOfThisMonth)

        // Calculate the start and end dates of the current week
        const today = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const thisWeekStart = new Date(now.setDate(now.getDate() - today)); // start of this week (Sunday)
        const thisWeekEnd = new Date(now.setDate(now.getDate() - today + 6)); // end of this week (Saturday)

        // get the money spent on this week
        const transactionsOfThisWeek = await transactionRepository.getTransactionsInRange(userId, thisWeekStart, thisWeekEnd);
        const moneySpentThisWeek = calculateMoneySpent(transactionsOfThisWeek)

        // get money spent in the last month only 
        const transactionsOfLastMonth = await transactionRepository.getTransactionsByMonth(userId, year, month - 1)
        const moneySpentLastMonth = calculateMoneySpent(transactionsOfLastMonth);
        console.log(transactionsOfLastMonth);

        // Construct money spent data object
        const moneySpentData = {
            thisWeek: moneySpentThisWeek,
            thisMonth: moneySpentThisMonth,
            lastMonth: moneySpentLastMonth
        }

        return res.status(200).json({ "Money Spent": moneySpentData })

    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

function calculateMoneySpent(transactions) {

    let totalAmount = 0;
    for (let i = 0; i < transactions.length; i++) {
        const transaction = transactions[i];
        const amount = transaction.amount;
        totalAmount += amount;
    }
    return totalAmount;
}