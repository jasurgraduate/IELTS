// Function to update word count
 function updateWordCount() {
    var text = document.getElementById("latinTextarea2").value;
    var wordCount = text.trim().split(/\s+/).length;
    document.getElementById("wordCount2").textContent = "Word Count: " + wordCount;
}

// Call the function on input event
document.getElementById("latinTextarea2").addEventListener("input", updateWordCount);