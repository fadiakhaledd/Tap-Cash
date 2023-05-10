export class TransactionRepository {
    constructor(prisma) { this.prisma = prisma }

    async getTransactionByID(id) {
        return this.prisma.transaction.findUnique({
            where: { id },
        })
    }

    async getTransactionBySenderID(sender_id) {
        return this.prisma.transaction.findMany({
            where: { sender: { UID: sender_id } },
        })
    }

    async getTransactionByRecipientID(recipient_id) {
        return this.prisma.transaction.findMany({
            where: { recipient: { UID: recipient_id } },
        })
    }


    async getTransactionByRequesterID(requester_id) {
        return this.prisma.transaction.findMany({
            where: { requester: { UID: requester_id } },
        })
    }


    async getTransactionByRecieverID(reciever_id) {
        return this.prisma.transaction.findMany({
            where: { reciever: { UID: reciever_id } },
        })
    }

    async createTransaction(newData) {
        return this.prisma.transaction.create({
            data: newData,
        });
    }

    async getTransactionsByMonth(sender_id, year, month) {
        const startDate = new Date(year, month - 1, 1); // first day in month
        const endDate = new Date(year, month, 0); // last day in month

        return this.prisma.transaction.findMany({
            where: {
                AND: [
                    { sender: { UID: sender_id } },
                    {
                        OR: [
                            { transactionType: 'TRANSFER' },
                            { transactionType: 'ONLINE_PAYMENT' },
                        ],
                    },
                    { created_at: { gte: startDate, lte: endDate } },
                ],
            },
            orderBy: { created_at: 'desc' },
        });
    }

    async getTransactionsInRange(userId, startDate, endDate) {
        const result = await this.prisma.transaction.findMany({
            where: {
                AND: [
                    { sender: { UID: userId } },
                    {
                        OR: [
                            { transactionType: 'TRANSFER' },
                            { transactionType: 'ONLINE_PAYMENT' },
                        ],
                    },
                    { created_at: { gte: startDate, lte: endDate } },
                ],
            },
            orderBy: { created_at: 'desc' },
        });

        return result;
    }
}


