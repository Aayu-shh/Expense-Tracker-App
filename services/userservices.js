exports.getExpenses = (req, where) => {
    return req.user.getExpenses(where);
}

exports.getReports = (req, where) => {
    return req.user.getReports(where);
}
