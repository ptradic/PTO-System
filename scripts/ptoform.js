    // Stores URLs for seasonal images that will be used as background images for the PTO information.
    const seasonImages = {
        spring: 'url(https://jscm.uk/wp-content/uploads/2022/04/Spring.jpg)',
        summer: 'url(https://media.cntraveler.com/photos/5ca2606227413200230736ae/master/pass/Summer-Travel_GettyImages-1028278382.jpg)',
        autumn: 'url(images/autumn.jpg)',
        winter: 'url(images/winter.jpeg)'
    };

    //getSeason determines the season based on a given date, while compareDates categorizes dates into 'past,' 'upcoming,' or 'current' based on their relation to the current date.
    function getSeason(date) {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        if ((month === 3 && day >= 20) || (month > 3 && month < 6) || (month === 6 && day <= 20)) {
            return 'spring';
        } else if ((month === 6 && day >= 21) || (month > 6 && month < 9) || (month === 9 && day <= 22)) {
            return 'summer';
        } else if ((month === 9 && day >= 23) || (month > 9 && month < 12) || (month === 12 && day <= 20)) {
            return 'autumn';
        } else {
            return 'winter';
        }
    }

    // Function to compare dates and categorize them as 'past,' 'upcoming,' or 'current'
    function compareDates(startDate, endDate) {
        const start = createDateFromString(startDate);
        const end = createDateFromString(endDate);
        const today = new Date();
    
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
    
        if (end.getTime() === today.getTime() || start.getTime() === today.getTime()) {
            return 'Current PTO';
        }
    
        if (end < today) {
            return 'Past PTO';
        }
    
        if (start > today) {
            return 'Upcoming PTO';
        }
    
        return 'Current PTO';
    }
    
    // Function to create a date object from a date string
    function createDateFromString(dateString) {
        const [day, month, year] = dateString.split('.').map(Number);
    
        if (isNaN(year) || isNaN(month) || isNaN(day)) {
            console.error(`Invalid date format: ${dateString}`);
            return null;
        }
    
        return new Date(year, month - 1, day);
    }
  
// Initializes and updates the calendar, including navigation buttons, month and year display, and clickable date elements.
document.addEventListener("DOMContentLoaded", function () {

    // Fetches employee information from a sample API and populates a dropdown menu with employee options.
    const batchTrack = document.getElementById("employeeSelect");
    console.log({ batchTrack });
    const getPost = async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/users");
      const data = await response.json();
      return data;
    };
    
    const displayOption = async () => {
      const options = await getPost();
      for (option of options) {
        const newOption = document.createElement("option");
        newOption.value = option.username;
        newOption.text = option.name;
        batchTrack.appendChild(newOption);
      }
    };
    
    displayOption();

    // Creates a calendar and adds features
    const monthYearElement = document.getElementById('monthYear');
    const datesElement = document.getElementById('dates');
    const selectedDateElement = document.getElementById('selectedDate');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    let currentDate = new Date();
    let selectedDates = [];
    
    // Function to update the calendar display based on the current date and selected dates
    const updateCalendar = () => {
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
    
        // Calculate the first and last day of the current month
        const firstDay = new Date(currentYear, currentMonth, 0);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const totalDays = lastDay.getDate();
        const firstDayIndex = firstDay.getDay();
        const lastDayIdex = lastDay.getDay();
    
        // Format the current month and year as a string and update the display
        const monthYearString = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        monthYearElement.textContent = monthYearString;
    
        let datesHTML = '';
    
        // Add inactive dates from the previous month
        for (let i = firstDayIndex; i > 0; i--) {
            const prevDate = new Date(currentYear, currentMonth, 0 - i + 1);
            datesHTML += `<div class="date inactive">${prevDate.getDate()}</div>`;
        }

        // Add active and selected dates for the current month
        for (let i = 1; i <= totalDays; i++) {
            const date = new Date(currentYear, currentMonth, i);
            const activeClass = date.toDateString() === new Date().toDateString() ? 'active' : '';
            const selectedClass = selectedDates.some(selectedDate => selectedDate.toDateString() === date.toDateString()) ? 'selected' : '';
            datesHTML += `<div class="date ${activeClass} ${selectedClass}" data-day="${i}">${i}</div>`;
        }
    
        // Add inactive dates from the next month
        for (let i = 1; i <= 7 - lastDayIdex; i++) {
            const nextDate = new Date(currentYear, currentMonth + 1, i);
            datesHTML += `<div class="date inactive">${nextDate.getDate()}</div>`;
        }
    
        datesElement.innerHTML = datesHTML;
    
        // Add click event listeners to each date element
        const dateElements = document.querySelectorAll('.date');
        dateElements.forEach(element => {
            element.addEventListener('click', () => {
                const day = element.getAttribute('data-day');
                selectDate(day);
            });
        });
    }
    
    // Function to handle the selection of a date
    const selectDate = (day) => {
        const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    
        // If two dates are already selected, clear the selection
        if (selectedDates.length === 2) {
            selectedDates = [];
        }
    
        // Add the selected date to the array and sort the array
        selectedDates.push(selectedDate);
        selectedDates.sort((a, b) => a - b);
    
        // Update the calendar and the selected date display
        updateCalendar();
        updateSelectedDate();
    }

    // Function to update the display of the selected date(s)
    const updateSelectedDate = () => {
        if (selectedDates.length === 2) {
            const [startDate, endDate] = selectedDates;
            selectedDateElement.textContent = `Selected Dates: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
        } else if (selectedDates.length === 1) {
            const [startDate] = selectedDates;
            selectedDateElement.textContent = `Selected Date: ${startDate.toLocaleDateString()}`;
        } else {
            selectedDateElement.textContent = 'No date selected';
        }
    }
    
    // Event listeners for previous and next month buttons, updating the calendar accordingly
    prevBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar();
    })
    
    nextBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar();
    })
    
    updateCalendar();
    updateSelectedDate();

    // Manages the creation and deletion of PTO entries for selected employees, ensuring no overlapping entries, and updates the visual representation of PTOs on the calendar.
    const ptoForm = document.getElementById("ptoForm");
    const ptoContainer = document.getElementById("ptoContainer");
    
    
    const ptoData = {};
    
    ptoForm.addEventListener("submit", function (event) {
        event.preventDefault();
    
        // Retrieves the selected employee from the dropdown list
        const employeeSelect = document.getElementById("employeeSelect");
        const selectedEmployee = employeeSelect.options[employeeSelect.selectedIndex].text;
    
        // Checks if both start and end dates are selected
        if (selectedDates.length === 2) {
            const [startDate, endDate] = selectedDates;
    
            if (!ptoData[selectedEmployee]) {
                ptoData[selectedEmployee] = [];
    
                // Creates a container for the employee and adds it to the DOM
                const employeeContainer = document.createElement("div");
                employeeContainer.classList.add("employee-container");
                employeeContainer.setAttribute("data-employee", selectedEmployee);
    
                // Creates an element displaying the employee's name and appends it to the container
                const employeeNameElement = document.createElement("div");
                employeeNameElement.textContent = `Employee: ${selectedEmployee}`;
                employeeContainer.appendChild(employeeNameElement);
                
                // Appends the employee container to the main PTO container
                ptoContainer.appendChild(employeeContainer);

                displayPTOInfo(selectedEmployee);
            }
    
            // Checks if the selected date range is already added for the employee
            const isDateAlreadyAdded = ptoData[selectedEmployee].some(pto => {
                return pto.startDate === startDate.toLocaleDateString() && pto.endDate === endDate.toLocaleDateString();
            });
    
            if (isDateAlreadyAdded) {
                alert("The selected dates have already been added for this employee.");
            } else {
                // Creates an element displaying the PTO information and a delete button
                const ptoInfoElement = document.createElement("div");
                ptoInfoElement.classList.add("pto-info");
                ptoInfoElement.textContent = `PTO Dates: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
                
                // Creates a delete button and adds an event listener to handle deletion
                const deleteButton = document.createElement("button");
                deleteButton.classList.add("delete-button");
                deleteButton.textContent = "Delete";
                deleteButton.addEventListener("click", function() {
                    deletePTODate(selectedEmployee, startDate.toLocaleDateString(), endDate.toLocaleDateString(), ptoInfoElement);
                });
            
                ptoInfoElement.appendChild(deleteButton);
            
                const employeeContainer = ptoContainer.querySelector(`.employee-container[data-employee="${selectedEmployee}"]`);
                employeeContainer.appendChild(ptoInfoElement);
            
                // Updates the PTO data with the new date range and associated DOM element
                ptoData[selectedEmployee].push({
                    startDate: startDate.toLocaleDateString(),
                    endDate: endDate.toLocaleDateString(),
                    element: ptoInfoElement
                });

                // Sets the background image of the PTO information based on the season of the start date
                const season = getSeason(startDate);
                ptoInfoElement.style.backgroundImage = seasonImages[season];
                ptoInfoElement.style.backgroundSize = 'cover';
                ptoInfoElement.style.color = 'black';

                // Calling the compareDates function and displaying the result
                const dateComparisonResult = compareDates(startDate.toLocaleDateString(), endDate.toLocaleDateString());
                displayComparisonResult(ptoInfoElement, dateComparisonResult);

            
                selectedDates = [];
            
                updateCalendar();
                updateSelectedDate();
            }
        } else {
            alert("Please select both start and end dates for the PTO.");
        }
    });
    
    // Support functions for deleting specific PTO entries for a selected employee.
    function deletePTODate(employee, startDate, endDate, element) {
        const indexToDelete = ptoData[employee].findIndex(pto => pto.startDate === startDate && pto.endDate === endDate);
    
        if (indexToDelete !== -1) {
            ptoData[employee].splice(indexToDelete, 1);
    
            element.remove();
    
            if (ptoData[employee].length === 0) {
                const employeeContainer = document.querySelector(`.employee-container[data-employee="${employee}"]`);
                if (employeeContainer) {
                    employeeContainer.remove();
                    delete ptoData[employee];
                }
            }
        }
    }

    // Support functions for displaying existing PTO information for a selected employee.
    function displayPTOInfo(employee) {
        const employeePTOData = ptoData[employee];
    
        if (employeePTOData) {
            const existingEmployeeContainer = document.querySelector(`.employee-container[data-employee="${employee}"]`);
    
            if (existingEmployeeContainer) {
                employeePTOData.forEach(pto => {
                    const ptoInfoElement = document.createElement("div");
                    ptoInfoElement.textContent = `Dates: ${pto.startDate} - ${pto.endDate}`;
                    existingEmployeeContainer.appendChild(ptoInfoElement);
                });
            }
        }
    }

    // Function to display the result of date comparison
    function displayComparisonResult(element, result) {
        const comparisonResultElement = document.createElement("div");
        comparisonResultElement.textContent = `${result}`;
        element.appendChild(comparisonResultElement);
    }      

});