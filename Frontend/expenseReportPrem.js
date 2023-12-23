const dailyTableBody = document.getElementById('dailyBody');
const weeklyTableBody = document.getElementById('weeklyBody');
const monthlyTableBody = document.getElementById('monthlyBody');

document.getElementById("dailyTableDiv").classList = "";
document.getElementById("weeklyTableDiv").classList = "displayNone";
document.getElementById("monthlyTableDiv").classList = "displayNone";

document.getElementById("reportType").addEventListener("change", (e) => {
    if (e.target.value == "Daily") {
        document.getElementById("dailyTableDiv").classList = "";
        document.getElementById("weeklyTableDiv").classList = "displayNone";
        document.getElementById("monthlyTableDiv").classList = "displayNone";
    }
    else if (e.target.value == "Weekly") {
        document.getElementById("weeklyTableDiv").classList = "";
        document.getElementById("dailyTableDiv").classList = "displayNone";
        document.getElementById("monthlyTableDiv").classList = "displayNone";
    }
    else if (e.target.value == "Monthly") {
        document.getElementById("monthlyTableDiv").classList = "";
        document.getElementById("weeklyTableDiv").classList = "displayNone";
        document.getElementById("dailyTableDiv").classList = "displayNone";
    }

})
document.getElementById('backbtn').onclick = e => window.location = "./expensePage.html";

document.addEventListener('DOMContentLoaded', async e => {
    const dailyExpenses = await axios.get("http://localhost:2000/premium/reportTable/d", { headers: { "Authorization": localStorage.getItem("token") } });
    const fetchedExpenses = dailyExpenses.data.result;
    console.log(fetchedExpenses);
    fetchedExpenses.expArr.forEach(expense => {
        dailyTableBody.innerHTML += `<tr><td>${expense.Date}</td><td>${expense.Description}</td><td>${expense.Category}</td><td>${expense.Amount}</td></tr>`
    })
    dailyTableBody.innerHTML += `<tr><td>Total Expense</td><td>${fetchedExpenses.totalExp}</td></tr>`

    const weeklyExpenses = await axios.get("http://localhost:2000/premium/reportTable/w", { headers: { "Authorization": localStorage.getItem("token") } });
    const fetchedWeeklyExpenses = weeklyExpenses.data.result;
    console.log(fetchedWeeklyExpenses);
    fetchedWeeklyExpenses.expArr.forEach(expense => {
        weeklyTableBody.innerHTML += `<tr><td>${expense.Date}</td><td>${expense.Amount}</td></tr>`
    })

    weeklyTableBody.innerHTML += `<tr><td>Total Expense</td><td>${fetchedWeeklyExpenses.totalExp}</td></tr>`

    const monthlyExpenses = await axios.get("http://localhost:2000/premium/reportTable/m", { headers: { "Authorization": localStorage.getItem("token") } });
    const fetchedMonthlyExpenses = monthlyExpenses.data.result;
    console.log(fetchedMonthlyExpenses);
    fetchedMonthlyExpenses.expArr.forEach(expense => {
        monthlyTableBody.innerHTML += `<tr><td>${expense.Date}</td><td>${expense.Amount}</td></tr>`
    })
    monthlyTableBody.innerHTML += `<tr><td>Total Expense</td><td>${fetchedMonthlyExpenses.totalExp}</td></tr>`

}, { once: true })