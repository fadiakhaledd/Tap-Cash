import { PrismaClient } from "@prisma/client";
import { UserRepository } from '../../repositoriess/UserRepository.js'

let prisma = new PrismaClient()
const userRepository = new UserRepository(prisma);


// the function only checks the existing of a user with this phone number
export async function getUserByPhone(req, res) {
    const userPhone = req.params.phone

    try {
        const user = await userRepository.findUserByPhone(userPhone)

        if (!user) {
            return res.status(404).json({ message: 'This phone number is not registered.' })
        }

        return res.status(200).json({ message: "User found" })

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}