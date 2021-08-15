var formElement = document.querySelector("#task-form");
var tasksToDoElement = document.querySelector("#tasks-to-do");

var taskFormHandler = function (event) {
	event.preventDefault(); // overides legacy browser behavior that submit uploads form to server

	var taskNameInput = document.querySelector("input[name='task-name']").value;
	var taskTypeInput = document.querySelector("select[name='task-type']").value;

	// check if input values is empty strings
	if (!taskNameInput || !taskTypeInput) {
		window.alert("You need to fill out the task form!");
		return;
	}

	formElement.reset();
	// pack up data as an object
	var taskDataObj = {
		name: taskNameInput,
		type: taskTypeInput,
	};

	createTaskElement(taskDataObj); // send it as an argument to createTaskEl
};

var createTaskElement = function (taskDataObj) {
	var listItemElement = document.createElement("li"); // create list item
	listItemElement.className = "task-item";

	var taskInfoElement = document.createElement("div"); // create div to hold task info and add to list item
	taskInfoElement.className = "task-info";
	// add HTML content to div
	taskInfoElement.innerHTML =
		"<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

	listItemElement.appendChild(taskInfoElement);
	tasksToDoElement.appendChild(listItemElement);
};

formElement.addEventListener("submit", taskFormHandler);
