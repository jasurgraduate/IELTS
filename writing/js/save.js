document.addEventListener("DOMContentLoaded", function() {
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

        // Save image data and its state
        const image1Data = imageContainer.querySelector('img') ? imageContainer.querySelector('img').src : '';
        localStorage.setItem('image1Data', image1Data);
        localStorage.setItem('image1Zoomed', imageContainer.querySelector('img') && imageContainer.querySelector('img').classList.contains('zoomed'));

        const image2Data = imageContainer2.querySelector('img') ? imageContainer2.querySelector('img').src : '';
        localStorage.setItem('image2Data', image2Data);
        localStorage.setItem('image2Zoomed', imageContainer2.querySelector('img') && imageContainer2.querySelector('img').classList.contains('zoomed'));
    }

    // Function to load data from local storage
    function loadFormData() {
        const savedTextarea1 = localStorage.getItem('latinTextarea');
        const savedTextarea2 = localStorage.getItem('latinTextarea2');
        const savedImage1Data = localStorage.getItem('image1Data');
        const savedImage1Zoomed = localStorage.getItem('image1Zoomed') === 'true';
        const savedImage2Data = localStorage.getItem('image2Data');
        const savedImage2Zoomed = localStorage.getItem('image2Zoomed') === 'true';

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
            if (savedImage1Zoomed) img.classList.add('zoomed');
        }
        if (savedImage2Data) {
            const img = document.createElement('img');
            img.src = savedImage2Data;
            imageContainer2.innerHTML = '';
            imageContainer2.appendChild(img);
            if (savedImage2Zoomed) img.classList.add('zoomed');
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

                // Add click event to toggle zoom
                img.addEventListener('click', function() {
                    img.classList.toggle('zoomed');
                    saveFormData(); // Save the zoom state
                });

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

                // Add click event to toggle zoom
                img.addEventListener('click', function() {
                    img.classList.toggle('zoomed');
                    saveFormData(); // Save the zoom state
                });

                saveFormData();
            };
            reader.readAsDataURL(file);
        }
    });

    // Optional: Add a remove image button
    const removeImageButtons = document.querySelectorAll('.removeImageButton');
    removeImageButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const container = event.target.closest('.imageContainer');
            container.innerHTML = ''; // Clear the image
            saveFormData(); // Save the state to remove the image
        });
    });
});
