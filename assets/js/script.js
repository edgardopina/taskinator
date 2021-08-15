var formElement = document.querySelector("#task-form");
var tasksToDoElement = document.querySelector("#tasks-to-do");

var taskFormHandler = function (event)
{
	event.preventDefault(); // overides legacy browser behavior that submit uploads form to server

	var taskNameInput = document.querySelector("input[name='task-name']").value;
	var taskTypeInput = document.querySelector("select[name='task-type']").value;

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

// Add a task form to HTML. We'll add an HTML form that will allow the user to enter the task name and type.

// Handle form submission. We'll use JavaScript to add a task to the list when the "Add Task" button is clicked.

// Capture form field values. We'll use JavaScript to capture the unique information the user enters (the task name and type).

// Organize functionality. We'll refactor the code to make it more maintainable.

// Address usability concerns. We'll improve the user experience by validating form input and resetting the form after the user clicks the "Add Task" button.

// Save our progress with Git. We'll commit and push our changes up to GitHub

// var buttonElement = document.querySelector("#save-task");

formElement.addEventListener("submit", taskFormHandler);
