function createEmployeeRecord(employeeArray){
    /* 
    takes a 4 element array corresponding to:
        first name (str), last name (str), title(str), and pay rate per hour (number)
    returns a javascript object with keys:
        firstName
        familyName
        title
        payPerHour
        timeInEvents
        timeOutEvents
    behavior: loads array elements into corresponding Object properties,
    initializes empty arrays on timeInEvents and timeOutEvents
    */

    //initialize a list of keys that correspond to elements in the employee array
    const keys = ["firstName", "familyName", "title", "payPerHour"]

    const employee = employeeArray.reduce((acc, value, index) => {
        //for each element in employeeArray, assign it to the accumulator object
        //with properties that match the index in the keys array
        acc[keys[index]] = value;
        return acc;
    }, {"timeInEvents": [], "timeOutEvents": []})
    
    return employee
}

function createEmployeeRecords(nestedArrays){
    /*
    takes an array of arrays
        converts each nested array into an employee record using createEmployeeRecord, and accumulates into a new Array
    returns an array of objects
    */
    return nestedArrays.map((employee) => createEmployeeRecord(employee))
}

function createTimeInEvent(employee, timestamp){
    /*
    takes an employee record and a "YYYY-MM-DD HHMM" timestamp,
        adds an object with keys to the timeInEvents array on the record:
        with keys:
            "type": "TimeIn",
            "hour": hour derived from timestamp,
            "date": date derived from timestamp
    */
   const keys = ["date", "hour"]

   const time = timestamp.split(" ").reduce((acc, value, index) => {
        acc[keys[index]] = value;
        if (keys[index] === "hour"){
            acc.hour = Number(value)
        }
        return acc;
   }, {"type": "TimeIn"})

   employee.timeInEvents.push(time)
   return employee
}

function createTimeOutEvent(employee, timestamp) {
    const keys = ["date", "hour"]

    const time = timestamp.split(" ").reduce((acc, value, index) => {
        acc[keys[index]] = value;
        if (keys[index] === "hour"){
            acc.hour = Number(value);
        }
        return acc;
    }, {"type": "TimeOut"})

    employee.timeOutEvents.push(time);
    return employee
}

function hoursWorkedOnDate(employee, date) {
    /*
    takes an employee record and a date,
    returns the number of hours elapsed between that date's timeInEvent
    and timeOutEvent
    */
    function findHour(events, date) {
        // Use reduce to find the event for the given date
        return events.reduce((acc, event) => {
            //if the time in/out event date matches input date, return the time in/out hour, 0 if not
            return event.date === date ? event.hour : acc;
        }, 0);
    }

    let timeInHour = findHour(employee.timeInEvents, date);
    let timeOutHour = findHour(employee.timeOutEvents, date);
    return (timeOutHour - timeInHour) * 0.01;

}

function wagesEarnedOnDate(employee, date){
    /*
    gets the hours worked on the input date and calculates total wage
    by employee pay per hour
    */
    let hours = hoursWorkedOnDate(employee, date);
    return employee.payPerHour * hours
}

function allWagesFor(employee){
    /*
    takes an employee record and returns pay owed for all dates in the record
    uses wagesEarnedOndate and accumulates the value of all dates worked by the employee in the record used as context
    */

    // get a list of dates from employee's timeInEvents
    const dates = employee.timeInEvents.map(event => event.date);

    // get wages with reduce by passing each date and employee to wagesEarnedOnDate, accumulating the total wages
    const totalWages = dates.reduce((total, date) => {
        return total + wagesEarnedOnDate(employee, date);
    }, 0)

    return totalWages;
}

function calculatePayroll(employees){
    /*
    takes an array of employee records, and returns sum of pay owed to all employees for all dates, as a number
    */
   return employees.reduce((totalWages, employee) => {
        return totalWages + allWagesFor(employee)
   }, 0)
}