const amount = document.querySelector("#amt");
const desc = document.querySelector("#desc");
const category = document.querySelector("#category");
const otherOpt = document.querySelector("#otherOpt");
const myForm = document.querySelector("#myExpForm")
const expList = document.querySelector("#elist");
const rzpBtnOne = document.querySelector('#rzp-button1');
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
        const newExpenseObj = await axios.post('http://localhost:2000/expense/addExpense', expObj, { headers: { "Authorization": localStorage.getItem("token") } });
        //Extracting data from resonse ==> Same as expObj
        console.log(newExpenseObj);
        displayExpense(newExpenseObj.data);
    }
    catch (err) { console.log(err); }
})

document.addEventListener('DOMContentLoaded', async e => {
    const expenses = await axios.get('http://localhost:2000/expense/getExpenses', { headers: { "Authorization": localStorage.getItem("token") } });
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
        const response = await axios.post('http://localhost:2000/expense/deleteExpense', obj, { headers: { "Authorization": localStorage.getItem("token") } });
        console.log(response.data);
        expList.removeChild(li);
    }
    expList.appendChild(li);
}

rzpBtnOne.addEventListener('click', async e => {
    // e.preventDefault();
    console.log("Youve hit BUY Premium Button, we're working on this feature , will be ready soon");
    const response = await axios.get('http://localhost:2000/purchase/premiumMembership', { headers: { "Authorization": localStorage.getItem("token") } });
    console.log(response);
    var options = {
        key: response.data.key_id,       //Key_id thrown from backend
        order_id: response.data.order.id,    //Order object thrown from backend
        handler: async paymentRes => {         //Callback if Payment is Success
            
            const paid = await axios.post("http://localhost:2000/purchase/updatePaymentStatus",{
                order_id:options.order_id ,
                payment_id:paymentRes.razorpay_payment_id
            },{ headers: { "Authorization": localStorage.getItem('token') } });
            console.log(paid);
            console.log(paymentRes);
            alert('You are a Premium Member Now!');
        }
    }
    //Display RazorPay popup from initializing RPay
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed',(resp)=>{
        console.log(resp);
        alert('Payment Failed, Something went Wrong');  
    })
})

