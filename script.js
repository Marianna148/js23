const controller = fileName => {
    return fetch(`data/${fileName}.json`)
        .then(response => response.json())
}

function getCurrency(data) {
    let currency;
    do {
        let userCurrency = Object.keys(data);
        currency = prompt(`Select the currency: ${userCurrency.join(", ")}!`).replaceAll(" ", "").toUpperCase();
    } while (!data[currency]);

    return currency;
}

let getAmountOfMoney = () => prompt(`Enter the amount you want to withdraw :`);

function getMoney(userData, bankData) {
    
    let addConfirm = confirm(`View card balance?`);

    if (addConfirm) {
        controller(userData)
            .then(userData => {
                let userDataValue;
                for (const key in userData) {
                    userDataValue = userData[key];
                } 
                return userDataValue; 
            })
            .then(userDataValue => {
                let currency = getCurrency(userDataValue);
                alert(`The balance is: ${userDataValue[currency]} ${currency}.`);
                alert('Thanks for using our ATM!');
            })
            
    } else if (!addConfirm) {
        return Promise.all([
            controller(userData),
            controller(bankData),
        ])
        .then(data => {
            let userData;
            let bankData;

            data.map(dataValue => dataValue.userData ? userData = dataValue.userData : bankData = dataValue.bankData);

            let currency = getCurrency(userData);

            while (!bankData[currency] || bankData[currency].max === 0) {
                alert(`The currency ${currency} is not available at the ATM, please choose another currency.`);
                currency = getCurrency(userData);
            }

            let amount = getAmountOfMoney();

            while (userData[currency] < amount) {
                alert(`There are not enough money in the account. Please select different amount.`);
                amount = getAmountOfMoney();
            }

            while (bankData[currency].max < amount) {
                alert(`The entered amount is greater than the allowable amount. Maximum withdrawal amount: ${bankData[currency].max}`);
                amount = getAmountOfMoney();
            }

            while (bankData[currency].min > amount) {
                alert(`The entered amount is less than allowed. Minimum withdrawal amount: ${bankData[currency].min}`);
                amount = getAmountOfMoney();
            }
            
            alert(`Take your money: ${amount} ${currency} ${bankData[currency].img}, and don't forget your card`);
            alert('Thank you, have a nice day!')
        })
    }
}

getMoney("userData", "bankData");