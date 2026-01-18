
const wrapper = document.querySelector('.wrapper');
const btnPopup = document.querySelector('.btnSignin-popup');
const iconClose = document.querySelector('.x-icon');

// Function to retrieve the value of a specific cookie
function getCookie(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}

// Check if the "loggedIn" cookie exists when the page loads
document.addEventListener('DOMContentLoaded', function () {
    const loggedInCookie = getCookie("loggedIn");
    if (loggedInCookie === "true") {
        // User is logged in, update the display accordingly
        document.getElementById('content').style.display = 'block';
        document.querySelector('.btnSignout-popup').style.display = 'block';
        document.querySelector('.btnSignin-popup').style.display = 'none';
    } else {
        // User is not logged in, set the default display
        document.getElementById('content').style.display = 'none';
        document.querySelector('.btnSignout-popup').style.display = 'none';
        document.querySelector('.btnSignin-popup').style.display = 'block';
    }
});

// Adding an event listener for the click event on the 'btnPopup' button
btnPopup.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
});

// Adding an event listener for the click event on the 'iconClose' icon
iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
});

// Adding an event listener for the submit event of the form within the HTML element with the class 'wrapper'
document.querySelector('.wrapper').addEventListener('submit', function (event) {
    event.preventDefault();

    // Retrieving the values entered in the email and password fields
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validating email and password and setting cookies and changing the display based on the validation result
    if (validateEmail(email) && validatePassword(password)) {
        document.cookie = "loggedIn=true; path=/;";
        wrapper.classList.remove('active-popup');
        document.getElementById('content').style.display = 'block';
        document.querySelector('.btnSignout-popup').style.display = 'block';
        document.querySelector('.btnSignin-popup').style.display = 'none';
    } else {
        alert('Pogreška pri validaciji podataka.');
    }
});

// Adding an event listener for the click event on the 'btnSignout-popup' button for user logout
document.querySelector('.btnSignout-popup').addEventListener('click', function () {
    document.cookie = "loggedIn=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; max-age=3600";
    document.getElementById('content').style.display = 'none';
    document.querySelector('.btnSignin-popup').style.display = 'block';
    this.style.display = 'none';
});

// Function for validating the format of an email address
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Function for validating password security criteria
function validatePassword(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}