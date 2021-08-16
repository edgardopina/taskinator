var formElement = document.querySelector("#task-form");
var tasksToDoElement = document.querySelector("#tasks-to-do");
var taskIdCounter = 0; // unique task id
var pageContentElement = document.querySelector("#page-content");

var editTask = function (taskId) {
	// get element with class="task-item" and with data-task-id=taskId
	var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
	var taskName = taskSelected.querySelector("h3.task-name").textContent; // get task name
	var taskType = taskSelected.querySelector("span.task-type").textContent; // get task type
	document.querySelector("#save-task").textContent = "Save Task";
	formElement.setAttribute("data-task-id", taskId);
};

var deleteTask = function (taskId) {
	// get element with class="task-item" and with data-task-id=taskId
	var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
	taskSelected.remove(); // delete task
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
	// pack up data as an object
	var taskDataObj = {
		name: taskNameInput,
		type: taskTypeInput,
	};

	createTaskElement(taskDataObj); // create tak element for taskDataObj
};

formElement.addEventListener("submit", taskFormHandler);

pageContentElement.addEventListener("click", taskButtonHandler);
