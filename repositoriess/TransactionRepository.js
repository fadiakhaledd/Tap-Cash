export class TransactionRepository {
    constructor(prisma) { this.prisma = prisma }

    async getTransactionByID(id) {
        return this.prisma.transaction.findUnique({
            where: { id },
        })
    }

    async getTransactionBySenderID(sender_id) {
        return this.prisma.transaction.findUnique({
            where: { sender_id },
        })
    }

    async getTransactionByRecipientID(recipient_id) {
        return this.prisma.transaction.findUnique({
            where: { recipient_id },
        })
    }

    async createTransaction(newData) {
        return this.prisma.transaction.create({
            data: newData,
        });
    }
}
