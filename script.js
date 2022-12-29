'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANK APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'en-UK ', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Johnnie Modebe Chukwudi',
  movements: [1000, 700, 50, -900, 7000, 7400, -790, -300],
  interestRate: 1.5,
  pin: 3333,

  movementsDates: [
    '2021-11-01T13:15:33.035Z',
    '2021-11-30T09:48:16.867Z',
    '2021-12-25T06:04:23.907Z',
    '2022-01-25T14:18:46.235Z',
    '2022-02-05T16:33:06.386Z',
    '2022-12-25T14:43:26.374Z',
    '2022-12-28T18:49:59.371Z',
    '2022-12-29T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US'
};
// console.log(new Date());


const accounts = [account1, account2, account3];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
const displayDate = function (acc, locale) {
  const calDayPassed = (date1, date2) =>
 Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));
    const dayPassed = calDayPassed(new Date(), acc)
    console.log(dayPassed);
    if(dayPassed === 0) return  `Today`;
    if(dayPassed === 1) return  `Yesterday`;
    if(dayPassed <= 7) return  `${dayPassed} days ago`;
    else{
      // const days1 = calDayPassed(new Date(2022, 10, 17), new Date(2022, 11, 29));
 
      return new Intl.DateTimeFormat(locale).format(acc.movementsDates);
    }
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    // you can loop over another array this trick e.g acc.movementsDates[i]
    const dates = new Date(acc.movementsDates[i]);
    const display = displayDate(dates, acc.locale);
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
       <div class="movements__date">${display}</div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out.toFixed(2))}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // (arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount;
//  FAKE LOGIN
currentAccount = account3;
updateUI(currentAccount);
containerApp.style.opacity = 100;

// //EXPERIMENTING API
// const currentDate = new Date();
// const operations={
//   day: `numeric`,
//   weekday: `long`,
//   hours: `numeric`,
//   minutes: `numeric`,
//   year: `numeric`,
//   month: `long`
// }
// // you can get user location and language from the user browser
// const locale= navigator.languages
// console.log(locale);
// labelDate.textContent = new Intl.DateTimeFormat(locale, operations).format(currentDate)
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  currentAccount;

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    // date Format day/ month/ year
    //EXPERIMENTING API
const currentDate = new Date();
const operations={
  day: `numeric`,
  weekday: `long`,
  hours: `numeric`,
  minutes: `numeric`,
  year: `numeric`,
  month: `long`
}
// you can get user location and language from the user browser
const locale= navigator.languages
console.log(locale);
labelDate.textContent = new Intl.DateTimeFormat(locale, operations).format(currentDate)
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //Add new Date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);
    //Add new Date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());
    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    index;
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
//TOPIC Number :converting and checking numbers

// Some Bug in javascript to be careful of
// Binary base two (2)
// console.log(0.1+ 0.2 === 0.3 ); // false

// conversions
Number(`30`);
+`30`; // is possible because of type coercion

//Parsing
// it's used to parse a Number from a string
// in to work the string has to start with a number not a word e.g

// THE PARSEINT FUNCTION CAN TAKE A SECOND ARGUMENT KNOW AS : REGEX
// regex is based the base Number system you are using E.G base 10
Number.parseInt(`30px`, 10); // 30
Number.parseInt(`esp30`); // NAN

// parsefloat
Number.parseInt(`2.5rem`); //2
Number.parseFloat(`2.5rem`); //2.5
// This function are know as global functions

//isNaN a function
// it is used to determine weather something is not a Number
// but  not a better of checking if something is not a number
Number.isNaN(20); // false
Number.isNaN(+`20e`); // true
Number.isNaN(`20`); // false

// isFinite
// is abetter method compared to isNaN
Number.isFinite(20); // true
Number.isFinite(`20`); // false
Number.isFinite(20 / 0); // false

// isInteger'
// used in checking integers
Number.isInteger(20); // true
Number.isInteger(`20`); // false
Number.isInteger(20 / 0); // false digit

// MATHEMATICAL Operations
//Maximum values
Math.max(5, 6, 56, 59, 48, 98, 47); //98
//Minimum values
Math.min(5, 6, 56, 59, 48, 98, 47); // 4

const randomInt = (min, max) =>
  Math.trunc(Math.random() * (max - min) + 1) + min;
randomInt(30, 50);

randomInt(1, 1000);

// Rounding integers
console.log(Math.trunc(38.96896));
//other ways approximation
console.log(Math.round(89.5));
Math.round(89.4);

// just round up not considering the nearest number
Math.ceil(34.8); //34

// just round down
Math.ceil(34.8); //34

// rounding decimals
(2.7).toFixed(0); // `3`
(2.757664).toFixed(3); // `2.758`
+(2.757664).toFixed(2); // 2.76

///TOPIC  Remainder Operator
console.log(5 % 2);

const oddEven = Array.from({ length: 20 }, _ => {
  let numbers = randomInt(0, 100);
  if (numbers % 2 === 0) {
    // console.log(`${numbers} is an even number`);
  } else {
    // console.log(`${numbers} is an odd number`);
  }
});
// let values =  Array.from(
//   document.querySelectorAll(`.movements__row`), (mov, i) =>
//      console.log(mov.textContent)
//   )

labelBalance.addEventListener(`click`, () => console.log());
document.querySelector(`body`).addEventListener(`keydown`, function (e) {
  if (e.key === `Enter`) {
    Array.from(document.querySelectorAll(`.movements__row`), (mov, i) => {
      const iterator = i;
      // console.log(iterator % 2,iterator % 3);
      console.log(iterator);
      if (iterator % 2 === 0) {
        mov.style.backgroundColor = `red`;
      }
      if (iterator % 3 === 0) {
        // mov.style.backgroundColor = `blue`
      }
    });
  }
});

// TOPIC BigInt
//  (878696284676767575775859084805495n);
// or
// (BigInt( 878696284676767575775859084805495));

//TOPIC DATES & TIME
const now = new Date();
// console.log(now);
const nod = new Date(2022, 11, 28, 9, 23, 5);

// creating a unix time
// console.log(new Date(0)); // Thu Jan 01 1970 01:00:00 GMT+0100 (West Africa Standard Time)

// DATE AND TIME METHODS
nod.getFullYear();
nod.getMonth();
nod.getDate();
nod.getDay();
nod.getHours();
nod.getMinutes();
nod.getSeconds();
nod.toISOString(); // 2022-12-28T08:23:05.000Z
nod.getTime(); // unix date for current date (1672215785000)

//You can also set Dates
// nod.setFullYear(2023);

// TOPIC DATE OPERATIONS
const future = new Date(2023, 10, 19, 15, 23);
// console.log(future);
// console.log(+future);

const calDayPassed = (date1, date2) => (date2 - date1) / (1000 * 60 * 60 * 24);

const days1 = calDayPassed(new Date(2022, 10, 17), new Date(2022, 11, 29));
console.log(days1);
