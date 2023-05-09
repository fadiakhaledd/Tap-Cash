import { PrismaClient } from "@prisma/client";
import { UserRepository } from '../../repositories/UserRepository.js'
import { VccRepository } from '../../repositories/VirtualCreditCardRepository.js'

let prisma = new PrismaClient()
const userRepository = new UserRepository(prisma);
const vccRepository = new VccRepository(prisma)

export async function getCreditCard(req, res) {
    const userId = req.params.id

    try {
        const user = await userRepository.findUserByID(userId)

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        // check if there's a credit card associated with the user
        const creditCard = await vccRepository.getCreditCardByUser(userId)

        if (creditCard) {
            return res.status(200).json({ 'VCC': creditCard })
        } else {
            return res.status(200).json({ message: "This user does not currently have a virtual credit card." })
        }

    } catch (error) {
        res.status(500).json({ message: 'Internal server error' })
    }
}