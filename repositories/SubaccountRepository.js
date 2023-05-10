export class SubaccountRepository {

    constructor(prisma) {
        this.prisma = prisma;
    }

    async createSubaccount(subaccountData) {
        const newSubaccount = await this.prisma.subaccount.create({
            data: subaccountData
        })
        return newSubaccount
    }

    async getSubaccountByID(id) {
        const subaccount = await this.prisma.subaccount.findUnique({
            where: { id },
            include: {
                owner: true,
                sentTransactions: true,
                receivedTransactions: true
            }
        })
        return subaccount
    }

    async getSubaccountByPhone(phone) {
        const subaccount = await this.prisma.subaccount.findUnique({
            where: { phone },
            include: {
                owner: true,
                sentTransactions: true,
                receivedTransactions: true
            }
        })
        return subaccount
    }

    async getSubaccountByUsername(username) {
        const subaccount = await this.prisma.subaccount.findUnique({
            where: { username },
            include: {
                owner: true,
                sentTransactions: true,
                receivedTransactions: true
            }
        })
        return subaccount
    }



    async updateSubaccount(subaccountID, updates) {
        const updatedSubaccount = await this.prisma.subaccount.update({
            where: { id: subaccountID },
            data: {
                ...updates
            }
        })
        return updatedSubaccount
    }

    async deleteSubaccount(subaccountID) {
        const deletedSubaccount = await this.prisma.subaccount.delete({
            where: { id: subaccountID }
        })
    }
}












