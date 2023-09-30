const Sib = require('sib-api-v3-sdk');
const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;
const tranEmailApi = new Sib.TransactionalEmailsApi();
const sender = {
    email: 'cgtractors1@gmail.com',
    name: 'Ajay Agrawal'
}

exports.forgot = async (req, res) => {
    const recievers = [
        {
            email: req.body.email
        }];
    const tranApi = await tranEmailApi.sendTransacEmail({
        sender,
        to: recievers,
        subject: "Test Email from Aayush's Expense tracker app",
        textContent: 'Hello {{params.reciever}}, your sample file is here ', params: {
            reciever: req.body.email
        }
    })
    return res.send(tranApi);
}
