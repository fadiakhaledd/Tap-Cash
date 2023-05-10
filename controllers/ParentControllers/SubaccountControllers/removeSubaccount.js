import { PrismaClient } from "@prisma/client";
import { UserRepository } from '../../../repositories/UserRepository.js'

import { SubaccountRepository } from '../../../repositories/SubaccountRepository.js'

let prisma = new PrismaClient()
const subaccountRepository = new SubaccountRepository(prisma);
const userRepository = new UserRepository(prisma);


export async function deleteSubaccount(req, res) {
    try {
        const subaccount = await subaccountRepository.getSubaccountByID(req.params.id)

        if (!subaccount) {
            return res.status(404).json({ error: 'Subaccount not found' });
        }

        // deleting the subaccount returns the money to the owner wallet
        const owner = await userRepository.findUserByID(subaccount.ownerID)
        const newOwnerBalance = owner.balance + subaccount.balance
        await userRepository.updateBalance(subaccount.ownerID, newOwnerBalance)

        // delete the subaccount
        const deletedSubaccount = await subaccountRepository.deleteSubaccount(req.params.id);
        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
