const sgMail = require('@sendgrid/mail');

//const sendgridAPIKey = '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';

sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const sendWelcomeEmail = (email,name)=>{
    sgMail.send({
        to: email,
        from: 'kiran@nodetutorial.com' ,
        subject:'Node test welcome message',
        text:`Welcome to the app ,  ${name} .Let us know your feedbackin the app`,
        html:'<h1>Test HTML</h1>'
    })
}

const sendCancelemail= (email,name)=>{
    sgMail.send({
    to:email,
    from: 'kiran@nodetutorial.com' ,
    subject:'Subscription Cancelled',
    text:`Hi ${name}, thanks for using our app, Hope to see you in future`
    })
}
module.exports ={
    sendWelcomeEmail,
    sendCancelemail
}