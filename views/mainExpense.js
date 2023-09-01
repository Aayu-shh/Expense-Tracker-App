const amount = document.querySelector("#amt");
const desc = document.querySelector("#desc");
const category = document.querySelector("#category");
const otherOpt = document.querySelector("#otherOpt");
const myForm = document.querySelector("#myExpForm")
const expList = document.querySelector("#elist");
const rzpBtnOne = document.querySelector('#rzp-button1');
const token = localStorage.getItem("token");
//--- To add TEXT BOX when Other option is clicked
// otherOpt.addEventListener('click',(e) => {
//     e.preventDefault();
//     const textInput = document.createElement('input',{type:'text'})
//     otherOpt.replaceChild(textInput);
// })

myForm.addEventListener('submit', async e => {
    e.preventDefault();
    const expObj = { Amount: amount.value, Description: desc.value, Category: category.value };
    try {
        const newExpenseObj = await axios.post('http://localhost:2000/expense/addExpense', expObj, { headers: { "Authorization": token } });
        //Extracting data from resonse ==> Same as expObj
        console.log(newExpenseObj);
        displayExpense(newExpenseObj.data);
    }
    catch (err) { console.log(err); }
})

document.addEventListener('DOMContentLoaded', async e => {
    const expenses = await axios.get('http://localhost:2000/expense/getExpenses', { headers: { "Authorization": token } });
    console.log(expenses);
    (expenses.data).forEach(expense => {
        displayExpense(expense);
    })
})

function displayExpense(obj) {
    const li = document.createElement('li');
    li.append(document.createTextNode(`${obj.Amount} : ${obj.Category} : ${obj.Description}`));
    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'DELETE';
    li.appendChild(deleteBtn);
    deleteBtn.onclick = async event => {
        const response = await axios.post('http://localhost:2000/expense/deleteExpense', obj, { headers: { "Authorization": token } });
        console.log(response.data);
        expList.removeChild(li);
    }
    expList.appendChild(li);
}

if (localStorage.getItem("isPremium")=='true') {
    showAsPremiumUser(rzpBtnOne);
}
else {
    rzpBtnOne.addEventListener('click', async e => {
        const newOrder = await axios.get('http://localhost:2000/purchase/premiumMembership', { headers: { "Authorization": token } });
        console.log(newOrder);
        var options = {
            key: newOrder.data.key_id,       //Key_id thrown from backend
            order_id: newOrder.data.order.id,    //Order object thrown from backend
            handler: async paymentRes => {         //Callback if Payment is Success

                const paid = await axios.post("http://localhost:2000/purchase/updatePaymentStatus", {
                    order_id: options.order_id,
                    payment_id: paymentRes.razorpay_payment_id
                }, { headers: { "Authorization": token } });
                localStorage.setItem('isPremium',true);
                showAsPremiumUser(rzpBtnOne);
                alert('You are a Premium Member Now!');
            }
        }
        //Display RazorPay popup from initializing RPay
        const rzp1 = new Razorpay(options);
        rzp1.open();
        e.preventDefault();

        rzp1.on('payment.failed', async resp => {
            const failed = await axios.post("http://localhost:2000/purchase/updatePaymentStatus", {
                order_id: options.order_id
            }, { headers: { "Authorization": token } });
            console.log(failed);
            localStorage.setItem("isPremium",false)
            alert('Something Went Wrong, please try again');
        })
    })
}

function showAsPremiumUser(rzpBtnOne){
    const prm = document.createElement('div');
    prm.innerHTML = "<b>PREMIUM USER<b>"
    rzpBtnOne.replaceWith(prm);
}