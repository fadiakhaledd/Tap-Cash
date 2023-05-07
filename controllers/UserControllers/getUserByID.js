import { PrismaClient } from "@prisma/client";
import { UserRepository } from '../../repositoriess/UserRepository.js'

let prisma = new PrismaClient()
const userRepository = new UserRepository(prisma);

export async function getUserById(req, res) {
    const userId = req.params.id

    try {
        const user = await userRepository.findUserByID(userId)

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        return res.json(user)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}