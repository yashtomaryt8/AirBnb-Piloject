const bookingConfirmationTemplate = (
    username,
    location,
    checkInDate,
    checkOutDate,
) => {
    return `
    <h2> Hello ${username},</h2>
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

module.exports = {
    bookingConfirmationTemplate,
}