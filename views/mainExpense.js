const amount = document.querySelector("#amt");
const desc = document.querySelector("#desc");
const category = document.querySelector("#category");
const otherOpt = document.querySelector("#otherOpt");
const myForm = document.querySelector("#myExpForm")
const expList = document.querySelector("#elist");
const rzpBtnOne = document.querySelector('#rzp-button1');
const ldrBrdBtn = document.querySelector("#ldrbrd");
const pgNumDiv = document.querySelector("#pageNumDiv");
const ldrdiv = document.querySelector('#ldrdiv');
const dwnlddiv = document.querySelector('#dwnlddiv')
const rprtBtn = document.querySelector("#report");
const dwnldBtn = document.querySelector('#dwnld');
const dwnldList = document.getElementById('reportList');
const token = localStorage.getItem("token");
const isPremium = localStorage.getItem("isPremium");
//--- To add TEXT BOX when Other option is clicked
// otherOpt.addEventListener('click',(e) => {
//     e.preventDefault();
//     const textInput = document.createElement('input',{type:'text'})
//     otherOpt.replaceChild(textInput);
// })

const backendApi = 'http://localhost:2000';
myForm.addEventListener('submit', async e => {
    e.preventDefault();
    const expObj = { Amount: amount.value, Description: desc.value, Category: category.value };
    try {
        const newExpenseObj = await axios.post(`${backendApi}/expense/add`, expObj, { headers: { "Authorization": token } });
        displayExpense(newExpenseObj.data);

        amount.value = "";
        category.value = "";
        desc.value = "";
    }
    catch (err) { console.log(err); }
})

document.addEventListener('DOMContentLoaded', async e => {
    const expensesObj = await getPageExpenses(1, parseInt(localStorage.getItem('expPerPage')));
    let lastPage = expensesObj.lastPage;
    expensesObj.expenses.forEach(exp => displayExpense(exp));
    {
        pgNumDiv.append(createPageButton());
    }
    if (expensesObj.hasNext) {
        pgNumDiv.append(createPageButton(expensesObj.currentPage + 1));
    }
    if (lastPage > expensesObj.currentPage)
        pgNumDiv.append(createPageButton(lastPage));

    pgNumDiv.addEventListener('click', async e => {
        if (e.target.tagName === 'BUTTON') {
            pgNumDiv.replaceChildren('');
            const currentPageNum = parseInt(e.target.innerText);
            const expensesObj = await getPageExpenses(currentPageNum, parseInt(localStorage.getItem('expPerPage')));
            lastPage = expensesObj.lastPage;
            if (expensesObj.hasPrevious) {
                const prevPgBtn = createPageButton(currentPageNum - 1)
                pgNumDiv.append(prevPgBtn);
            }
            {
                const currentPageBtn = createPageButton(currentPageNum)
                pgNumDiv.append(currentPageBtn);
            }
            if (expensesObj.hasNext) {
                const nxtPageBtn = createPageButton(currentPageNum + 1)
                pgNumDiv.append(nxtPageBtn);
            }
            if (currentPageNum + 1 < lastPage) {
                console.log(currentPageNum + 1);
                pgNumDiv.append(createPageButton(lastPage));
            }
        }
    })

    document.getElementById('expPrPg').addEventListener('change', async e => {
        if (e.target.tagName == "SELECT") {
            localStorage.setItem('expPerPage', e.target.value);

        }
    })


    if (isPremium === 'true') {
        const reports = await axios.get(`${backendApi}/premium/reports/`, { headers: { "Authorization": token } });
        (reports.data).forEach(report => {
            displayDownloadedFileInList(report);
        })
        showAsPremiumUser(rzpBtnOne);
        rprtBtn.onclick = e => {
            window.location = "./expenseReportPrem.html";
        }
        ldrBrdBtn.onclick = e => {
            e.preventDefault();
            const ldrHeading = document.createElement('h1');
            ldrHeading.innerHTML = '<b>Leaderboard</b>';
            ldrdiv.appendChild(ldrHeading);
            leaderBoard();

        }
        dwnldBtn.onclick = async e => {
            const downloadRes = await axios.get(`${backendApi}/premium/download/`, { headers: { "Authorization": token } });
            if (downloadRes.status == 200) {
                var a = document.createElement('a');
                a.href = downloadRes.data.fileURL;
                a.click();
                var tmpRprtObj = { url: a.href, createdAt: downloadRes.data.createdAt }
                displayDownloadedFileInList(tmpRprtObj);
            }
            else {
                console.log("Failed");
            }
        }
    }
    else {
        ldrBrdBtn.remove();
        rprtBtn.remove();
        dwnldBtn.remove();
        dwnlddiv.remove();
        rzpBtnOne.addEventListener('click', async e => {
            const newOrder = await axios.get(`${backendApi}/purchase/premiumMembership`, { headers: { "Authorization": token } });
            var options = {
                key: newOrder.data.key_id,       //Key_id thrown from backend
                name: "Chattisgarh Tractors",
                order_id: newOrder.data.order.id,    //Order object thrown from backend
                prefill: {
                    name: "Ajay Agrawal",
                    email: "cgtractors1@gmail.com",
                    contact: "+919926654343"

                },
                "theme": {
                    "color": "#3399cc"
                },
                handler: async paymentRes => {         //Callback if Payment is Success

                    const paid = await axios.post("http://localhost:2000/purchase/payment", {
                        order_id: options.order_id,
                        payment_id: paymentRes.razorpay_payment_id
                    }, { headers: { "Authorization": token } });
                    localStorage.setItem('isPremium', true);
                    alert('You are a Premium Member Now!');
                    location.reload();
                }
            }
            //Display RazorPay popup from initializing RPay
            const rzp1 = new Razorpay(options);
            rzp1.open();

            rzp1.on('payment.failed', async resp => {
                const failed = await axios.post(`${backendApi}/purchase/payment`, {
                    order_id: options.order_id
                }, { headers: { "Authorization": token } });
                console.log(failed);
                localStorage.setItem("isPremium", false)
                alert('Something Went Wrong, please try again');
            })
        })
    }

})

function createPageButton(pgNum) {
    const pageBtn = document.createElement('button');
    pgNum = pgNum || 1;
    pageBtn.innerText = `${pgNum}`
    pageBtn.onclick = async () => {
        expList.replaceChildren("");
        const pageExpObj = await getPageExpenses(pgNum, parseInt(localStorage.getItem('expPerPage')));
        console.log(pageExpObj)
        pageExpObj.expenses.forEach(expense => displayExpense(expense));
    }
    return pageBtn;
}

function showAsPremiumUser(rzpBtnOne) {
    const prm = document.createElement('div');
    prm.innerHTML = "<b>PREMIUM USER<b>";
    rzpBtnOne.replaceWith(prm);
}

async function getPageExpenses(page, expPerPage) {
    const response = await axios.get(`${backendApi}/expense?page=${page}&expPerPg=${parseInt(localStorage.getItem('expPerPage'))}`, { headers: { "Authorization": token } });
    const expensesObj = response.data;
    return expensesObj;

}
function displayExpense(obj) {
    const li = document.createElement('li');
    li.append(document.createTextNode(`${obj.Amount} : ${obj.Category} : ${obj.Description}`));
    const deleteBtn = document.createElement('button');
    deleteBtn.innerText = 'DELETE';
    li.appendChild(deleteBtn);
    deleteBtn.onclick = async event => {
        try {
            const response = await axios.post(`${backendApi}/expense/delete`, obj, { headers: { "Authorization": token } });
            expList.removeChild(li);
        }
        catch (err) {
            console.log(err);
        }
    }
    expList.appendChild(li);
}

function displayDownloadedFileInList(report) {
    const li = document.createElement('li');
    li.innerHTML = `Report from ${report.createdAt}`;
    const dwnldBtn = document.createElement('button');
    dwnldBtn.innerHTML = "Download";
    dwnldBtn.onclick = () => {
        const a = document.createElement('a')
        a.href = report.url;
        a.click();
    }
    li.append(dwnldBtn);
    dwnldList.appendChild(li);
}

async function leaderBoard() {
    const response = await axios.get(`${backendApi}/premium/leaderBoard`, { headers: { "Authorization": token } });
    const userData = response.data;
    const ul = document.createElement('ul');
    for (let i = 0; i < userData.length; i++) {
        const li = document.createElement('li');
        li.appendChild(document.createTextNode(`Name: ${userData[i].Name} ; Total Amount: ${userData[i].totalExpenses || 0}`));
        ul.appendChild(li);
    }
    ldrdiv.appendChild(ul);
}