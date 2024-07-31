document.addEventListener("DOMContentLoaded", function() {
    // Select the elements
    const latinTextarea = document.getElementById('latinTextarea');
    const latinTextarea2 = document.getElementById('latinTextarea2');
    const imageUpload = document.getElementById('imageUpload');
    const imageContainer = document.getElementById('imageContainer');
    const imageUpload2 = document.getElementById('imageUpload2');
    const imageContainer2 = document.getElementById('imageContainer2');

    // Function to save text area and image data to local storage
    function saveFormData() {
        localStorage.setItem('latinTextarea', latinTextarea.value);
        localStorage.setItem('latinTextarea2', latinTextarea2.value);

        // Save image data
        const image1Data = imageContainer.querySelector('img') ? imageContainer.querySelector('img').src : '';
        localStorage.setItem('image1Data', image1Data);

        const image2Data = imageContainer2.querySelector('img') ? imageContainer2.querySelector('img').src : '';
        localStorage.setItem('image2Data', image2Data);
    }

    // Function to load data from local storage
    function loadFormData() {
        const savedTextarea1 = localStorage.getItem('latinTextarea');
        const savedTextarea2 = localStorage.getItem('latinTextarea2');
        const savedImage1Data = localStorage.getItem('image1Data');
        const savedImage2Data = localStorage.getItem('image2Data');

        if (savedTextarea1 !== null) {
            latinTextarea.value = savedTextarea1;
        }
        if (savedTextarea2 !== null) {
            latinTextarea2.value = savedTextarea2;
        }
        if (savedImage1Data) {
            const img = document.createElement('img');
            img.src = savedImage1Data;
            imageContainer.innerHTML = '';
            imageContainer.appendChild(img);
        }
        if (savedImage2Data) {
            const img = document.createElement('img');
            img.src = savedImage2Data;
            imageContainer2.innerHTML = '';
            imageContainer2.appendChild(img);
        }
    }

    // Load saved data when the page loads
    loadFormData();

    // Save data whenever the text areas change
    latinTextarea.addEventListener('input', saveFormData);
    latinTextarea2.addEventListener('input', saveFormData);

    // Handle image uploads
    imageUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                imageContainer.innerHTML = '';
                imageContainer.appendChild(img);
                saveFormData();
            };
            reader.readAsDataURL(file);
        }
    });

    imageUpload2.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                imageContainer2.innerHTML = '';
                imageContainer2.appendChild(img);
                saveFormData();
            };
            reader.readAsDataURL(file);
        }
    });
});
