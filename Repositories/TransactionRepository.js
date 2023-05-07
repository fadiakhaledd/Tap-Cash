class TransactionRepository {
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

    async createTransaction(sender_id, recipient_id, amount) {
        return this.prisma.transaction.create({
            data: {
                sender_id,
                recipient_id,
                amount,
                status: "COMPLETED",
            },
        });
    }
}
