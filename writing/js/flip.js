document.getElementById('task1Btn').addEventListener('click', function() {
    showTask('task1');
    setActiveButton(this);
});

document.getElementById('task2Btn').addEventListener('click', function() {
    showTask('task2');
    setActiveButton(this);
});

function showTask(taskId) {
    document.querySelectorAll('.task-content').forEach(function(task) {
        task.classList.remove('active');
    });
    document.getElementById(taskId).classList.add('active');
}

function setActiveButton(button) {
    document.querySelectorAll('.tab-button').forEach(function(btn) {
        btn.classList.remove('active');
    });
    button.classList.add('active');
}
