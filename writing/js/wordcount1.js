 // Function to update word count
 function updateWordCount() {
    var text = document.getElementById("latinTextarea").value;
    var wordCount = text.trim().split(/\s+/).length;
    document.getElementById("wordCount").textContent = "Word Count: " + wordCount;
}

// Call the function on input event
document.getElementById("latinTextarea").addEventListener("input", updateWordCount);


 