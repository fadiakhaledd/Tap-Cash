import { PrismaClient } from "@prisma/client";
import { UserRepository } from '../../Repositories/UserRepository.js'
import { TransactionRepository } from '../../Repositories/TransactionRepository.js'

let prisma = new PrismaClient()
const userRepository = new UserRepository(prisma);
const transactionRepository = new TransactionRepository(prisma);



async function returnMoney(sender, recipient, amount) {
    // Deduct the amount from the sender's balance
    let newSenderBalance = sender.balance + amount;
    await userRepository.updateBalance(sender.UID, newSenderBalance)

    // Add the amount to the recipient's balance
    let newRecipientBalance = sender.balance - amount;
    await userRepository.updateBalance(recipient.UID, newRecipientBalance)


    // Create a new transaction record in the database
    let transactionData = {
        sender_id: sender.UID,
        recipient_id: recipient.UID,
        amount: amount,
        status: "FAILED",
    }

    const transaction = transactionRepository.createTransaction(transactionData)

    return { transaction };
}

// the function that performs the logic for sending money
async function sendMoney(sender, recipient, amount) {

    // Check if sender has enough balance to make the transaction
    if (sender.balance < amount) {
        throw new Error('Insufficient balance');
    }

    // Deduct the amount from the sender's balance
    let newSenderBalance = sender.balance - amount;
    await userRepository.updateBalance(sender.UID, newSenderBalance)

    // Add the amount to the recipient's balance
    let newRecipientBalance = sender.balance + amount;
    await userRepository.updateBalance(recipient.UID, newRecipientBalance)

    // Create a new transaction record in the database
    let transactionData = {
        sender_id: sender.UID,
        recipient_id: recipient.UID,
        amount: amount,
        status: "COMPLETED",
    }

    const transaction = transactionRepository.createTransaction(transactionData)

    return { transaction };
}

// send mpney by username
export async function sendMoneyByUsername(req, res) {

    try {

        const { senderId, recipientUsername, amount } = req.body;

        // Retrieve sender and recipient users from the database
        const sender = await userRepository.findUserByID(senderId);
        const recipient = await userRepository.findUserByUsername(recipientUsername);
        console.log(sender)


        if (!sender) throw new Error('Sender ID is incorrect');
        if (!recipient) throw new Error('Recipient username is not registered');
        if (sender === recipient) throw new Error('sender and recipient are the same user')

        const result = await sendMoney(sender, recipient, amount);

        res.status(201).json({ message: 'Transaction completed successfully', ...result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export async function sendMoneyByPhoneNumber(req, res) {
    try {
        const { senderId, recipientPhone, amount } = req.body;

        // Retrieve sender and recipient users from the database
        const sender = await userRepository.findUserByID(senderId);
        const recipient = await userRepository.findUserByPhone(recipientPhone);


        if (!sender) throw new Error('Sender ID is incorrect');
        if (!recipient) throw new Error('Recipient phone number is not registered');
        if (sender === recipient) throw new Error('sender and recipient are the same user')

        const result = await sendMoney(sender, recipient, amount);

        res.status(201).json({ message: 'Transaction completed successfully', ...result });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
