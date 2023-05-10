import { PrismaClient } from "@prisma/client";

import { SubaccountRepository } from '../../../repositories/SubaccountRepository.js'

let prisma = new PrismaClient()
const subaccountRepository = new SubaccountRepository(prisma);

export async function getSubaccount(req, res) {
    try {
        const subaccount = await subaccountRepository.getSubaccountByID(req.params.id);
        if (!subaccount) {
            return res.status(404).json({ error: 'Subaccount not found' });
        }
        return res.status(200).json({ subaccount });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
}