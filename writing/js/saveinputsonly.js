document.addEventListener("DOMContentLoaded", function() {
    // Select the elements
    const latinTextarea = document.getElementById('latinTextarea');
    const latinTextarea2 = document.getElementById('latinTextarea2');

    // Function to save data to local storage
    function saveFormData() {
        localStorage.setItem('latinTextarea', latinTextarea.value);
        localStorage.setItem('latinTextarea2', latinTextarea2.value);
    }

    // Function to load data from local storage
    function loadFormData() {
        const savedTextarea1 = localStorage.getItem('latinTextarea');
        const savedTextarea2 = localStorage.getItem('latinTextarea2');

        if (savedTextarea1 !== null) {
            latinTextarea.value = savedTextarea1;
        }
        if (savedTextarea2 !== null) {
            latinTextarea2.value = savedTextarea2;
        }
    }

    // Load saved data when the page loads
    loadFormData();

    // Save data whenever the text areas change
    latinTextarea.addEventListener('input', saveFormData);
    latinTextarea2.addEventListener('input', saveFormData);
});
