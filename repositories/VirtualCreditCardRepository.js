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

    async getCreditCardByCCNumber(cardNumber) {
        return await this.prisma.virtualCreditCard.findUnique({
            where: { cardNumber },
        });
    }

    async updateCreditCard(id, amount, usedFlag) {
        return this.prisma.virtualCreditCard.update({
            where: { id },
            data: {
                amount: amount,
                usedFlag: usedFlag
            },
        });
    }

}