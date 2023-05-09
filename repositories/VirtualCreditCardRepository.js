export class VccRepository {
    constructor(prisma) { this.prisma = prisma }

    async createVCC(VCCData) {
        return await this.prisma.virtualCreditCard.create({
            data: VCCData
        });
    }

    async deleteVCC(id) {
        return await this.prisma.virtualCreditCard.delete({
            where: { id },
        });
    }

    async getCreditCardByUser(userId) {
        return await this.prisma.virtualCreditCard.findUnique({
            where: { userId },
        });
    }
}