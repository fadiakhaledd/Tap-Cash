export class UserRepository {

    constructor(prisma) {
        this.prisma = prisma;
    }

    async findUserByID(UID) {
        return this.prisma.user.findUnique({
            where: { UID: UID },
        });
    }

    async findUserByPhone(phone) {
        return this.prisma.user.findUnique({
            where: { phone },
        })
    }

    async findUserByUsername(username) {
        return this.prisma.user.findUnique({
            where: { username },
        })
    }

    async findUserByNationalID(nationalID) {
        return this.prisma.user.findUnique({
            where: { nationalID },
        })
    }

    async createUser(user) {
        return this.prisma.user.create({
            data: user,
        });
    }

    async updateUser(UID, newData) {
        return this.prisma.user.update({
            where: { UID },
            data: newData,
        });
    }

    async deleteUser(UID) {
        return this.prisma.user.delete({
            where: { UID },
        });
    }

    async updateBalance(UID, balance) {
        return this.prisma.user.update({
            where: { UID },
            data: { balance },
        });
    }

    async getTransactionsByMonth(UID, year, month) {
        const startDate = new Date(year, month - 1, 1); // first day in month
        const endDate = new Date(year, month, 0); // last day in month

        // date is zero based, date(2023,5-1,1) -> 1/may/2023 
        // but (2023,5,0) -> the third argument = 0 -> the last day of the previous month.

        return this.prisma.transaction.findMany({
            where: {
                AND: [
                    //get transactions where the passed user is either the sender or the recipient 
                    { OR: [{ sender_id: UID }, { recipient_id: UID }] },
                    // gte : greater than or equal to
                    // lte : less than or equal to
                    { created_at: { gte: startDate, lte: endDate } },
                ],
            },
            orderBy: { created_at: 'desc' },
        });
    }

    async getTransactionsLastWeek(UID) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7); // subtract 7 days from current date
        return this.prisma.transaction.findMany({
            where: {
                AND: [
                    { OR: [{ sender_id: UID }, { recipient_id: UID }] },
                    { created_at: { gte: startDate } },
                ],
            },
            orderBy: { created_at: 'desc' },
            include: { sender: true, recipient: true },
        });
    }
}
