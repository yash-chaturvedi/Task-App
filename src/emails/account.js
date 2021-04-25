const sgMail = require('@sendgrid/mail')

const sendgridApiKey = process.env.SGMAIL_API_KEY

sgMail.setApiKey(sendgridApiKey)

const welcomeMail = (email, name) => {
    sgMail.send({
        to:email,
        from:'zerefclasher042@gmail.com',
        subject:`Welcome ${name} `,
        text: 'Thanks for joining in.'
    })
}

const cancellationMail = (email, name) => {
    sgMail.send({
        to:email,
        from:'zerefclasher042@gmail.com',
        subject:`Goodbye ${name} `,
        text: 'Let me know what features would have made you stay.'
    })
}

module.exports = {
    welcomeMail,
    cancellationMail
}