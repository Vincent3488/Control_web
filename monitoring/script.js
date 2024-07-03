document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const tasksContainer = document.getElementById('tasksContainer');
    const taskSelect = document.getElementById('taskSelect');
    const startStopBtn = document.getElementById('startStopBtn');
    const timerDisplay = document.getElementById('timer');
    const timeLogsContainer = document.getElementById('timeLogsContainer');
    const ongoingTasks = document.getElementById('ongoingTasks');
    const timeTracked = document.getElementById('timeTracked');
    const performanceMetrics = document.getElementById('performanceMetrics');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let timeLogs = JSON.parse(localStorage.getItem('timeLogs')) || [];
    let timer = null;
    let currentTaskId = null;
    let startTime = null;

    const renderTasks = () => {
        tasksContainer.innerHTML = '';
        taskSelect.innerHTML = '<option value="">Select a Task</option>';
        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.textContent = `${task.title} - Due: ${task.dueDate}`;
            tasksContainer.appendChild(taskItem);

            const taskOption = document.createElement('option');
            taskOption.value = task.id;
            taskOption.textContent = task.title;
            taskSelect.appendChild(taskOption);
        });
        updateDashboard();
    };

    const renderTimeLogs = () => {
        timeLogsContainer.innerHTML = '';
        timeLogs.forEach(log => {
            const logItem = document.createElement('li');
            logItem.textContent = `Task: ${log.taskTitle} - Time: ${log.time}`;
            timeLogsContainer.appendChild(logItem);
        });
        updateDashboard();
    };

    const updateDashboard = () => {
        ongoingTasks.textContent = tasks.length;
        const totalHours = timeLogs.reduce((total, log) => total + log.hours, 0);
        timeTracked.textContent = `${totalHours.toFixed(2)} hrs`;
        performanceMetrics.textContent = totalHours > 0 ? 'Good' : 'N/A';
    };

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskTitle = document.getElementById('taskTitle').value;
        const taskDescription = document.getElementById('taskDescription').value;
        const taskDueDate = document.getElementById('taskDueDate').value;
        const taskId = Date.now().toString();
        const task = { id: taskId, title: taskTitle, description: taskDescription, dueDate: taskDueDate };
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
        taskForm.reset();
    });

    startStopBtn.addEventListener('click', () => {
        if (timer) {
            clearInterval(timer);
            timer = null;
            const endTime = new Date();
            const timeDiff = (endTime - startTime) / 1000;
            const hours = (timeDiff / 3600).toFixed(2);
            const task = tasks.find(t => t.id === currentTaskId);
            const timeLog = { taskId: currentTaskId, taskTitle: task.title, time: `${hours} hrs`, hours: parseFloat(hours) };
            timeLogs.push(timeLog);
            localStorage.setItem('timeLogs', JSON.stringify(timeLogs));
            renderTimeLogs();
            startStopBtn.textContent = 'Start';
            timerDisplay.textContent = '00:00:00';
        } else {
            currentTaskId = taskSelect.value;
            if (!currentTaskId) {
                alert('Please select a task.');
                return;
            }
            startTime = new Date();
            timer = setInterval(() => {
                const now = new Date();
                const timeDiff = now - startTime;
                const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
                timerDisplay.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            }, 1000);
            startStopBtn.textContent = 'Stop';
        }
    });

    renderTasks();
    renderTimeLogs();
});
