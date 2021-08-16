var formElement = document.querySelector("#task-form");
var taskIdCounter = 0; // unique task id
var tasksToDoElement = document.querySelector("#tasks-to-do");
var tasksInProgressElement = document.querySelector("#tasks-in-progress");
var tasksCompletedElement = document.querySelector("#tasks-completed");
var pageContentElement = document.querySelector("#page-content");
var tasksPersistance = []; // array of tasks for persistance

var saveTasks = function () {
	localStorage.setItem("tasks", JSON.stringify(tasksPersistance));
};

var taskStatusChangeHandler = function (event) {
	var taskId = event.target.getAttribute("data-task-id"); // get the task's Id
	var statusValue = event.target.value.toLowerCase(); // get the currently selected option's value and convert to lowercase to standardrize
	var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

	if (statusValue === "to do") {
		tasksToDoElement.appendChild(taskSelected);
	} else if (statusValue === "in progress") {
		tasksInProgressElement.appendChild(taskSelected);
	} else if (statusValue === "completed") {
		tasksCompletedElement.appendChild(taskSelected);
	}

	// update status in tasksPersistance array
	for (var i = 0; i < tasksPersistance.length; ++i) {
		if (tasksPersistance[i].id === parseInt(taskId)) {
			tasksPersistance[i].status = statusValue;
		}
	}
	saveTasks(); // persists taskinator to localStorage
};

var completeEditTask = function (taskName, taskType, taskId) {
	console.log("in completeEditTask");
	var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
	//set new values
	taskSelected.querySelector("h3.task-name").textContent = taskName;
	taskSelected.querySelector("span.task-type").textContent = taskType;

	// loops through tasksPersistance arrayt and task object to update with new content
	for (var i = 0; i < tasksPersistance.length; ++i) {
		if (tasksPersistance[i].id === parseInt(taskId)) {
			tasksPersistance[i].name = taskName;
			tasksPersistance[i].type = taskType;
		}
	}
	formElement.removeAttribute("data-task-id"); // reset add/edit processing flag
	document.querySelector("#save-task").textContent = "Add Task";
	saveTasks(); // persists taskinator to localStorage
	window.alert("Task updated!");
};
var editTask = function (taskId) {
	// get element with class="task-item" and with data-task-id=taskId
	var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
	var taskName = taskSelected.querySelector("h3.task-name").textContent; // get task name
	document.querySelector("input[name='task-name']").value = taskName;
	var taskType = taskSelected.querySelector("span.task-type").textContent; // get task type
	document.querySelector("select[name='task-type']").value = taskType;
	document.querySelector("#save-task").textContent = "Save Task";
	formElement.setAttribute("data-task-id", taskId);
};

var deleteTask = function (taskId) {
	// get element with class="task-item" and with data-task-id=taskId
	var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
	taskSelected.remove(); // delete task

	var updatedTaskArr = []; // create new array to hold updated list of tasks

	//loop through current tasks
	for (let i = 0; i < tasksPersistance.length; ++i) {
		// if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
		if (tasksPersistance[i].id !== parseInt(taskId)) {
			updatedTaskArr.push(tasksPersistance[i]);
		}
	}

	tasksPersistance = updatedTaskArr; // reassign tasks array to be the same as updatedTaskArr
	saveTasks(); // persists taskinator to localStorage
};

var taskButtonHandler = function (event) {
	var targetElement = event.target; // get target element from event
	var taskId = targetElement.getAttribute("data-task-id"); // get the element's task
	// the matches sintax could be done with clasName
	if (targetElement.matches(".edit-btn")) {
		editTask(taskId);
	} else if (targetElement.matches(".delete-btn")) {
		deleteTask(taskId);
	}
};

var createTaskActions = function (taskId) {
	var actionContainerElement = document.createElement("div"); // creater container <div> element
	actionContainerElement.className = "task-actions"; // styles <div> element

	// create edit button
	var editButtonElement = document.createElement("button");
	editButtonElement.textContent = "Edit";
	editButtonElement.className = "btn edit-btn";
	editButtonElement.setAttribute("data-task-id", taskId);
	actionContainerElement.appendChild(editButtonElement); // adds Edit button to <div> element

	// create delete button
	var deleteButtonElement = document.createElement("button");
	deleteButtonElement.textContent = "Delete";
	deleteButtonElement.className = "btn delete-btn";
	deleteButtonElement.setAttribute("data-task-id", taskId);
	actionContainerElement.appendChild(deleteButtonElement); // adds Delete button to <div> element

	// add dropdown to select task status
	var statusSelectElement = document.createElement("select");
	statusSelectElement.className = "select-status";
	statusSelectElement.setAttribute("name", "status-change");
	statusSelectElement.setAttribute("data-task-id", taskId);
	actionContainerElement.appendChild(statusSelectElement); // adds empty <select> to <div> element

	var statusChoices = ["To Do", "In Progress", "Completed"]; // adds options to empty select
	var statusChoicesLength = statusChoices.length;
	for (var i = 0; i < statusChoicesLength; i++) {
		var statusOptionElement = document.createElement("option"); // create option element
		statusOptionElement.setAttribute("value", statusChoices[i]);
		statusOptionElement.textContent = statusChoices[i];
		statusSelectElement.appendChild(statusOptionElement); // append to select
	}

	return actionContainerElement; // returns <div> element with Edit button, Delete button, and Select option dropdown
};

var createTaskElement = function (taskDataObj) {
	var listItemElement = document.createElement("li"); // create list item
	listItemElement.className = "task-item";

	listItemElement.setAttribute("data-task-id", taskIdCounter); // add task id as a custom attribute

	var taskInfoElement = document.createElement("div"); // create div to hold task info and add to list item
	taskInfoElement.className = "task-info";
	// add task name and type to div
	taskInfoElement.innerHTML =
		"<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

	listItemElement.appendChild(taskInfoElement); // adds task to list-item

	var taskActionElement = createTaskActions(taskIdCounter); // builds edit/delete/status actions

	listItemElement.appendChild(taskActionElement); // adds actions to list item
	tasksToDoElement.appendChild(listItemElement); //adds list item to TO DO list

	taskDataObj.id = taskIdCounter; // adds tasl Id to task object
	tasksPersistance.push(taskDataObj); // add task object to array for persistance
	saveTasks(); // persists taskinator to localStorage

	taskIdCounter++; // increase task counter for next unique task id
};

var taskFormHandler = function (event) {
	event.preventDefault(); // overides legacy browser behavior that submit uploads form to server
	// gets input values
	var taskNameInput = document.querySelector("input[name='task-name']").value;
	var taskTypeInput = document.querySelector("select[name='task-type']").value;

	// validates and messages error condition when input values are empty strings
	if (!taskNameInput || !taskTypeInput) {
		window.alert("You need to fill out the task form!");
		// return false;
		return; // resturn to eventListener
	}

	formElement.reset(); // resets form element

	var isEdit = formElement.hasAttribute("data-task-id");
	if (isEdit) {
		var taskId = formElement.getAttribute("data-task-id");
		completeEditTask(taskNameInput, taskTypeInput, taskId);
	} else {
		// pack up data as an object
		var taskDataObj = {
			name: taskNameInput,
			type: taskTypeInput,
			status: "to do",
		};
		createTaskElement(taskDataObj); // create tak element for taskDataObj
	}
};

formElement.addEventListener("submit", taskFormHandler);

pageContentElement.addEventListener("click", taskButtonHandler);

pageContentElement.addEventListener("change", taskStatusChangeHandler);
