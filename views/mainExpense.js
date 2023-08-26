const amount = document.querySelector("#amt");
const desc = document.querySelector("#desc");
const category = document.querySelector("#category");
const otherOpt = document.querySelector("#otherOpt");
const myForm = document.querySelector("#myExpForm")
const expList = document.querySelector("#elist");

//--- To add TEXT BOX when Other option is clicked
// otherOpt.addEventListener('click',(e) => {
//     e.preventDefault();
//     const textInput = document.createElement('input',{type:'text'})
//     otherOpt.replaceChild(textInput);
// })

myForm.addEventListener('submit', async e => {
    e.preventDefault();
    const expObj = { Amount: amount.value, Description: desc.value, Category: category.value, userId: window.localStorage.getItem('id') };
    try {
        const responseObj = await axios.post('http://localhost:2000/expense/addExpense', expObj);
        //Extracting data from resonse ==> Same as expObj
        console.log(responseObj);
        displayExpense(responseObj.data);
    }
    catch (err) { console.log(err); }
})

document.addEventListener('DOMContentLoaded', async e => {
    const expenses = await axios.get('http://localhost:2000/expense/getExpenses');
    //console.log(expenses);
    (expenses.data).forEach(expense => {
        displayExpense(expense);
    })
})

function displayExpense(obj) {
    if (isExpenseOfThisUser(obj)) {
        const li = document.createElement('li');
        li.append(document.createTextNode(`${obj.Amount} : ${obj.Category} : ${obj.Description}`));
        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'DELETE';
        li.appendChild(deleteBtn);
        deleteBtn.onclick = async event => {
            const response = await axios.post('http://localhost:2000/expense/deleteExpense', obj);
            console.log(response.data);
            expList.removeChild(li);
        }
        expList.appendChild(li);
    }
}

function isExpenseOfThisUser(obj) {
    if (obj.userId == window.localStorage.getItem('id'))
        return true;
}
