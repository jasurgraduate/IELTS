function setupImageArea(imageUploadId, replaceBtnId, imageContainerId, imageAreaId) {
    let currentScale = 1;
    let currentContextMenu = null;

    function updateImageScale(image, scale) {
        image.style.transform = `scale(${scale})`;
    }

    function displayImage(imageContainer, src, alt, imageArea) {
        imageContainer.innerHTML = ''; // Clear the container to show only one image at a time
        const img = document.createElement('img');
        img.src = src;
        img.alt = alt;
        img.style.width = '100%'; // Ensure the image fits horizontally
        imageContainer.appendChild(img);
        attachImageEventHandlers(img, imageContainer);
        // Hide the "Add an image" button
        document.getElementById(replaceBtnId).style.display = 'none';
    }

    function attachImageEventHandlers(img, imageContainer) {
        img.addEventListener('click', function(event) {
            if (event.ctrlKey) {
                currentScale += 0.1;
                updateImageScale(img, currentScale);
            }
        });

        img.addEventListener('contextmenu', function(event) {
            showContextMenu(event, imageContainer);
        });
    }

    function showContextMenu(event, imageContainer) {
        event.preventDefault();

        // Remove existing context menu if any
        if (currentContextMenu) {
            currentContextMenu.remove();
        }

        const contextMenu = document.createElement('div');
        contextMenu.classList.add('context-menu'); // Optional: Add a class for styling

        // Calculate position based on mouse event coordinates
        const posX = event.clientX;
        const posY = event.clientY;
        contextMenu.style.position = 'fixed'; // Use fixed positioning to align with viewport
        contextMenu.style.top = `${posY}px`;
        contextMenu.style.left = `${posX}px`;
        contextMenu.style.backgroundColor = '#fff';
        contextMenu.style.border = '1px solid #ccc';
        contextMenu.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.3)';
        contextMenu.style.zIndex = 1000;

        const options = ['Replace', 'Remove', 'Zoom In', 'Zoom Out'];
        options.forEach(option => {
            const item = document.createElement('div');
            item.classList.add('context-menu-item'); // Optional: Add a class for styling
            item.style.padding = '10px';
            item.style.cursor = 'pointer';
            item.innerText = option;
            item.addEventListener('click', () => {
                contextMenu.remove();
                switch (option) {
                    case 'Replace':
                        document.getElementById(imageUploadId).click();
                        break;
                    case 'Remove':
                        imageContainer.innerHTML = '';
                        currentScale = 1;
                        document.getElementById(imageUploadId).value = ''; // Reset the file input
                        // Add text back after image is removed
                        const placeholderText = document.createElement('div');
                        placeholderText.innerText = 'No image selected. Double click or just insert image using Ctrl+V';
                        imageContainer.appendChild(placeholderText);
                        // Show the "Add an image" button again
                        document.getElementById(replaceBtnId).style.display = 'block';
                        break;
                    case 'Zoom In':
                        currentScale += 0.1;
                        updateImageScale(imageContainer.querySelector('img'), currentScale);
                        break;
                    case 'Zoom Out':
                        currentScale = Math.max(0.1, currentScale - 0.1);
                        updateImageScale(imageContainer.querySelector('img'), currentScale);
                        break;
                }
            });
            contextMenu.appendChild(item);
        });

        document.body.appendChild(contextMenu);
        currentContextMenu = contextMenu;

        // Remove context menu on click outside
        document.addEventListener('click', function onClickOutside(e) {
            if (!contextMenu.contains(e.target)) {
                contextMenu.remove();
                document.removeEventListener('click', onClickOutside);
                currentContextMenu = null;
            }
        });
    }

    function handleDragAndDrop(imageArea, imageContainer) {
        imageArea.addEventListener('dragover', function(event) {
            event.preventDefault();
            imageArea.style.borderColor = '#000';
        });

        imageArea.addEventListener('dragleave', function() {
            imageArea.style.borderColor = '#ccc';
        });

        imageArea.addEventListener('drop', function(event) {
            event.preventDefault();
            imageArea.style.borderColor = '#ccc';

            const file = event.dataTransfer.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    displayImage(imageContainer, e.target.result, 'Dropped Image', imageArea);
                };
                reader.readAsDataURL(file);
            }
        });

        imageArea.addEventListener('paste', function(event) {
            const items = event.clipboardData.items;
            for (let item of items) {
                if (item.type.startsWith('image/')) {
                    const file = item.getAsFile();
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        displayImage(imageContainer, e.target.result, 'Pasted Image', imageArea);
                    };
                    reader.readAsDataURL(file);
                }
            }
        });

        imageArea.addEventListener('dblclick', function() {
            document.getElementById(imageUploadId).click();
        });

        imageArea.addEventListener('wheel', function(event) {
            if (event.ctrlKey) {
                event.preventDefault();
                if (event.deltaY < 0) {
                    currentScale += 0.1;
                } else {
                    currentScale = Math.max(0.1, currentScale - 0.1);
                }
                updateImageScale(imageContainer.querySelector('img'), currentScale);
            }
        });

        imageArea.addEventListener('contextmenu', function(event) {
            showContextMenu(event, imageContainer);
        });
    }

    // Initialize event handlers for the image area
    const imageUpload = document.getElementById(imageUploadId);
    const imageContainer = document.getElementById(imageContainerId);
    const imageArea = document.getElementById(imageAreaId);

    imageUpload.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                displayImage(imageContainer, e.target.result, 'Uploaded Image', imageArea);
            };
            reader.readAsDataURL(file);
        }
    });

    handleDragAndDrop(imageArea, imageContainer);

    // Event listener for the "Add an image" button
    const replaceBtn = document.getElementById(replaceBtnId);
    replaceBtn.addEventListener('click', function() {
        document.getElementById(imageUploadId).click();
    });

    // Ensure the file input is accessible for the user to choose a file
    document.getElementById(imageUploadId).addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                displayImage(imageContainer, e.target.result, 'Uploaded Image', imageArea);
            };
            reader.readAsDataURL(file);
        }
    });

    // Add initial placeholder text
    const placeholderText = document.createElement('div');
    placeholderText.innerText = 'No image selected. Double click or just insert image using Ctrl+V';
    imageContainer.appendChild(placeholderText);
}

document.addEventListener("DOMContentLoaded", function() {
    // Setup for Image Area 1
    setupImageArea('imageUpload', 'replaceBtn1', 'imageContainer', 'imageArea1');
});

document.addEventListener("DOMContentLoaded", function() {
    // Setup for Image Area 2
    setupImageArea('imageUpload2', 'replaceBtn2', 'imageContainer2', 'imageArea2');
});
