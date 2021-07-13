const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const SendDataToPatient = (email, name, data) => {
    sgMail.send({
        to: email,
        from: 'slin4eria@gmail.com',
        subject: 'Ваша запись',
        text: `Здравствуйте, ${name}, спасибо за то,что обратились ко мне,ваша запись на приём: ${data}`
    })
}

module.exports = {
    SendDataToPatient
}