var createTaskHandler = function (event) {
	event.preventDefault(); // overides legacy browser behavior that submit uploads form to server

	var listItemElement = document.createElement("li");
	listItemElement.className = "task-item";
	listItemElement.textContent = "This is a new task.";
	tasksToDoElement.appendChild(listItemElement);
};

// Add a task form to HTML. We'll add an HTML form that will allow the user to enter the task name and type.

// Handle form submission. We'll use JavaScript to add a task to the list when the "Add Task" button is clicked.

// Capture form field values. We'll use JavaScript to capture the unique information the user enters (the task name and type).

// Organize functionality. We'll refactor the code to make it more maintainable.

// Address usability concerns. We'll improve the user experience by validating form input and resetting the form after the user clicks the "Add Task" button.

// Save our progress with Git. We'll commit and push our changes up to GitHub

// var buttonElement = document.querySelector("#save-task");

var formElement = document.querySelector("#task-form");
var tasksToDoElement = document.querySelector("#tasks-to-do");

formElement.addEventListener("submit", createTaskHandler);
