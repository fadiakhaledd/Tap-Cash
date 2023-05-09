// validate a credit card info provided from the user 
export function validateCreditCardInfo(cardNumber, cvv, expiryDate) {
    return (validateCreditCardNumber(cardNumber) && validateCVV(cvv) && !isCreditCardExpired(expiryDate));
}

// Egyptian credit card numbers are validated using the Luhn algorithm 
function validateCreditCardNumber(cardNumber) {

    // Remove any non-digit characters from the credit card number
    const cleanCardNumber = cardNumber.replace(/\D/g, '');

    // Step 1: Multiply even digits by 2 and add the product of all numbers
    let evenDigitProductSum = 0;
    for (let i = cleanCardNumber.length - 2; i >= 0; i -= 2) {
        const evenDigitProduct = cleanCardNumber[i] * 2;
        evenDigitProductSum += evenDigitProduct >= 10 ? evenDigitProduct - 9 : evenDigitProduct;
    }

    // Step 2: Add the remaining odd digits
    let oddDigitSum = 0;
    for (let i = cleanCardNumber.length - 1; i >= 0; i -= 2) {
        oddDigitSum += parseInt(cleanCardNumber[i], 10);
    }

    // Step 3: Add the sums from steps 1 and 2 and check if the result is divisible by 10
    const totalSum = evenDigitProductSum + oddDigitSum;

    const creditCardNumberCheck = (totalSum % 10 === 0)
    return creditCardNumberCheck
}

function validateCVV(cvv) {
    // CVV should be a string with 3 or 4 digits
    if (/^\d{3,4}$/.test(cvv)) {
        return true;
    } else {
        return false;
    }
}

function isCreditCardExpired(expiryDate) {

    const month = parseInt(expiryDate.substring(0, 2));
    const year = `20${parseInt(expiryDate.substring(3))}`

    const expiration = new Date(year, month - 1);

    const now = new Date();
    return expiration < now;
}
