import { PrismaClient } from "@prisma/client";


let prisma = new PrismaClient()
const userRepository = new UserRepository(prisma);


export async function addFundToUser(req, res) {
    try {
        const { cardNumber, cardHolderName, expiryDate, CVV, userPhoneNumber, amount } = req.body

    } catch (error) {

    }
}