document.addEventListener("DOMContentLoaded", function() {
    const submitButton = document.querySelector('button[type="submit"]');
    const resetButton = document.getElementById('resetBtn');
    const resultDiv = document.getElementById('result');
    const resultMessage = document.getElementById('resultMessage');
    const closeBtn = document.getElementById('closeBtn');
    const inputs = document.querySelectorAll("input[type='text']");
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');

    // Function to display the popup with a message
    function showPopup(message, confettiOptions) {
        resultMessage.textContent = message;
        resultDiv.style.display = 'block'; // Show the popup

        // Trigger confetti if options are provided
        if (confettiOptions) {
            confetti(confettiOptions);
        }
    }

    // Function to save all input and checkbox values to local storage
    function saveFormData() {
        inputs.forEach((input, index) => {
            localStorage.setItem(`input${index}`, input.value);
        });
        checkboxes.forEach((checkbox, index) => {
            localStorage.setItem(`checkbox${index}`, checkbox.checked);
        });
    }

    // Function to load all input and checkbox values from local storage
    function loadFormData() {
        inputs.forEach((input, index) => {
            const savedValue = localStorage.getItem(`input${index}`);
            if (savedValue !== null) {
                input.value = savedValue;
            }
        });
        checkboxes.forEach((checkbox, index) => {
            const savedChecked = localStorage.getItem(`checkbox${index}`);
            checkbox.checked = savedChecked === 'true';
        });
    }

    // Load form data on page load
    loadFormData();

    // Attach the updateResult function to the submit button's click event
    submitButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent form submission

        // Count the number of false checkboxes
        const falseCheckboxes = document.querySelectorAll('input[type="checkbox"]:checked[value="false"]');
        const falseCount = falseCheckboxes.length;

        // Calculate the number of correct answers
        const correctCount = 40 - falseCount;

        // Prepare the message and confetti options
        let message = `Correct Answers: ${correctCount}`;
        let confettiOptions = null;

        if (correctCount > 34) {
            message += ". Congratulations! You made it!";
            confettiOptions = {
                particleCount: 3500, // Number of particles
                spread: window.innerWidth, // Spread angle of the particles (matches screen width)
                angle: 135,  // Angle in degrees at which particles are launched (towards top)
                startVelocity: 90, // Initial speed of the particles
                colors: ['#FF0000', '#00FF00', '#0000FF'], // Different colors of the particles
                shapes: ['square', 'circle'], // Shapes of the particles
                origin: { y: 1 } // Starting point (y: 1 is at the bottom of the screen)
            };
        } else if (correctCount > 30 && correctCount <= 34) {
            message += ". That was close! Keep it up!";
        }

        // Show the popup with the result message and confetti
        showPopup(message, confettiOptions);
    });

    // Add click event listener to the reset button
    resetButton.addEventListener("click", function() {
        // Clear the content of the result div
        resultDiv.style.display = 'none'; // Hide the popup

        // Uncheck all checkboxes
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        // Clear all input fields
        inputs.forEach(input => {
            input.value = "";
        });

        // Clear local storage
        localStorage.clear();
    });

    // Handle click event on the close button
    closeBtn.addEventListener('click', function() {
        resultDiv.style.display = 'none'; // Hide the popup immediately
    });

    // Handle enter key navigation for text inputs
    inputs.forEach((input, index) => {
        input.addEventListener("keydown", function(event) {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault(); // Prevent default behavior of Enter key
                const nextIndex = index + 1;
                if (nextIndex < inputs.length) {
                    inputs[nextIndex].focus(); // Move focus to the next input
                }
            } else if (event.key === "Enter" && event.shiftKey) {
                event.preventDefault(); // Prevent default behavior of Shift + Enter
                const prevIndex = index - 1;
                if (prevIndex >= 0) {
                    inputs[prevIndex].focus(); // Move focus to the previous input
                    inputs[prevIndex].select(); // Select all text in the previous input
                }
            }
        });
    });

    // Save form data whenever an input or checkbox value changes
    inputs.forEach((input, index) => {
        input.addEventListener('input', saveFormData);
    });
    checkboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', saveFormData);
    });
});
