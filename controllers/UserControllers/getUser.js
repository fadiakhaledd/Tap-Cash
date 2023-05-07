import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export async function getUserById(req, res) {
    const userId = req.params.id

    try {
        const user = await prisma.user.findUnique({
            where: {
                UID: userId
            },
            select: {
                UID: true,
                firstName: true,
                LastName: true,
                phone: true,
                email: true,
                username: true,
                birthdate: true,
                balance: true,
                nationalID: true,
                nationalIdFileName: true,
                password: false



            }
        })

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        res.json(user)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal server error' })
    }
}