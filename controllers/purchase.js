const Razorpay = require('razorpay');
const Order = require('../models/order');
const User = require('../models/user');

exports.purchasePremium = (req, res) => {
    try {
        var rzpInstnce = new Razorpay({
            key_id: process.env.RZP_KEY_ID,
            key_secret: process.env.RZP_KEY_SECRET
        })
        const amount = 2500;
        rzpInstnce.orders.create({ amount, currency: "INR" }, (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }
            //using Sequelize Magic Function createOrder()
            req.user.createOrder({ orderid: order.id, status: "PENDING" })
                .then(() => {
                    return res.status(201).json({ order, key_id: rzpInstnce.key_id })
                })
        })
    }
    catch (err) {
        console.log(err);
        res.status(403).json({ message: "Something Went Wrong", error: err });
    }
}

exports.updatePaymentStatus = async (req, res) => {
    const { order_id, payment_id } = req.body;
    try {
        const myOrder = await Order.findOne({ where: { orderid: order_id } });
        if (!payment_id) {
            //USE Promise ALL to Optimise below un related code
            const [res1,res2] = await Promise.all([myOrder.update({ status: 'FAILED' }), req.user.update({ isPremiumUser: false })]);
            console.log(res1);
            console.log(res2);

            res.status(200).json({ message: "Payment Failed, Please retry" });
        }
        else {
            //USE Promise ALL to Optimise below un related code
            const [res1, res2] = await Promise.all([myOrder.update({ status: 'SUCCESSFFUL', paymentid: payment_id }), req.user.update({ isPremiumUser: true })]);
            console.log(res1);
            console.log(res2);
            res.status(202).json({ message: "User is a Premium user Now" });
        }
    }
    catch (err) {
        res.status(403).json({ message: "Something Went Wrong", error: err });
    }
}