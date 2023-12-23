const uuid = require('uuid');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const ForgotPasswordRequest = require('../models/forgotpasswordrequest');
const Sib = require('sib-api-v3-sdk');
const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;
const tranEmailApi = new Sib.TransactionalEmailsApi();
const sender = {
    email: 'cgtractors1@gmail.com',
    name: 'Chhattisgarh Tractors'
}

exports.forgot = async (req, res) => {
    const newUuid4 = uuid.v4();
    const myUser = await User.findOne({ where: { email: req.body.email } });
    const recievers = [
        {
            email: req.body.email
        }];
    const tranApi = await tranEmailApi.sendTransacEmail({
        sender,
        to: recievers,
        subject: "Reset Password link from Aayush's Expense tracker app",
        htmlContent: `<p> Hi {{params.email1}}, click on the below link to reset your password<p>
                    <h2><a href="http://localhost:2000/password/resetpassword/${newUuid4}">Reset Password</a></h2>`, params: { email1: req.body.email }
    })
    const newfgr = await ForgotPasswordRequest.create({ id: newUuid4, isActive: true, userId: myUser.id });
    res.status(200).send({success:true, message: 'Reset password email sent sucessfully' });
}

exports.reset = async (req, res) => {
    try{
    const reqUuid = req.params.uuid;
    if (uuid.validate(reqUuid)) {
        const fgr = await ForgotPasswordRequest.findOne({ where: { id: reqUuid } });
        if (null != fgr && fgr.isActive)
        return res.status(200).send(`
            <html>
                <head>
                    <title>Reset Password Page</title>
                </head>
                    <body>
                        <form action="/password/updatepassword/${reqUuid}" method="POST">
                            <label for="pass">Enter new password:</label>
                            <input type="password" id="pass" name="pass">
                            <input type="submit" value="Update Password">
                        </form>
                    </body>
            </html>
            `)
    }
    else {
        res.status(404).send('Invalid reset request!')
    }
    }
    catch(err){
        console.log('Something went wrong, check below\n',err);
    }
}

exports.update = async (req, res) => {
    try {
        const newPass = req.body.pass;
        const requuid = req.params.uuid;
        const fgr = await ForgotPasswordRequest.findOne({ where: { id: requuid } });
        if(fgr.isActive){
            fgr.update({ isActive: false });       //opens reset pass just once thatsy why turn to false
            const myUser = await User.findOne({ where: { id: fgr.userId } });
            const encrypass = await bcrypt.hash(newPass, 10);
            myUser.update({ Password: encrypass })
                .then(() => {
                    res.redirect('/');
                    //res.send({ status: 'sucess', message: 'password updated sucessfully' })
                 })
        }
        else{
            res.status(200).send({success:"failure", message:"Reset Password link invalid"});     //Re check what statusCd to set
        }
    }
    catch (err) {
        console.log(err);
        res.send({ status: 'failure', error: err });
    }
}
