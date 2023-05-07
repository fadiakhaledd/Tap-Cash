export class MoneyTransferService {
    constructor(userRepository, transactionRepository) {
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    async sendMoney(sender, recipient, amount) {
        // Check if sender has enough balance to make the transaction
        if (sender.balance < amount) {
            throw new Error('Insufficient balance');
        }

        // Deduct the amount from the sender's balance
        let newSenderBalance = sender.balance - amount;
        await this.userRepository.updateBalance(sender.UID, newSenderBalance);

        // Add the amount to the recipient's balance
        let newRecipientBalance = sender.balance + amount;
        await this.userRepository.updateBalance(recipient.UID, newRecipientBalance);

        // Create a new transaction record in the database
        let transactionData = {
            sender_id: sender.UID,
            recipient_id: recipient.UID,
            amount: amount,
            status: "COMPLETED",
        }
        const transaction = await this.transactionRepository.createTransaction(transactionData);

        return { transaction };
    }

    async returnMoney(sender, recipient, amount) {
        // Add the amount from the sender's balance
        let newSenderBalance = sender.balance + amount;
        await this.userRepository.updateBalance(sender.UID, newSenderBalance)

        // Deduct the amount to the recipient's balance
        let newRecipientBalance = sender.balance - amount;
        await this.userRepository.updateBalance(recipient.UID, newRecipientBalance)


        // Create a new transaction record in the database
        let transactionData = {
            sender_id: sender.UID,
            recipient_id: recipient.UID,
            amount: amount,
            status: "FAILED",
        }

        const transaction = await this.transactionRepository.createTransaction(transactionData)

        return { transaction };
    }


}