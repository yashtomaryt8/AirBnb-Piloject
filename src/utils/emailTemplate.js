const bookingConfirmationTemplate = (
    username,
    location,
    checkInDate,
    checkOutDate,
) => {
    return `
    <h2> Hello, ${username},</h2>
    <p>Thank you for booking with us! We are excited to confirm your reservation at our property in ${location}.</p>
    <h3>Booking Details:</h3>
    <ul>
        <li><strong>Check-in Date:</strong> ${checkInDate}</li>
        <li><strong>Check-out Date:</strong> ${checkOutDate}</li>
        <li><strong>Location:</strong> ${location}</li>
    </ul>
    <p>If you have any questions or need further assistance, feel free to reach out to us.</p>
    <p>We look forward to welcoming you soon!</p>

    `
}


const paymentConfirmationTemplate = (username, location, status, totalPrice, checkInDate, checkOutDate) => {
    return `
    <h2> Hello, ${username},</h2>
    <p>Thank you for your payment! We are excited to confirm your reservation at our property in ${location}.</p>
    <h3>Booking Details:</h3>
    <ul>
        <li><strong>Check-in Date:</strong> ${checkInDate}</li>
        <li><strong>Check-out Date:</strong> ${checkOutDate}</li>
        <li><strong>Status:</strong> ${status}</li>
        <li><strong>Total Price:</strong> ₹${totalPrice}</li>
    </ul>
    <p>If you have any questions or need further assistance, feel free to reach out to us.</p>
    <p>We look forward to welcoming you soon!</p>

    `
}


const resetPasswordTemplate = (username, link) => {
    return `
    <h2> Hello, ${username},</h2>
    <p>We received a request to reset your password. Please click the link below to reset it:</p>
    <a href="${link}">Reset Password</a>
    <p>If you did not request this, please ignore this email.</p>
    `
}

module.exports = {
    bookingConfirmationTemplate,
    paymentConfirmationTemplate,
    resetPasswordTemplate,
}