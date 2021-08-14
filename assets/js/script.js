var createTaskHandler = function () {
	var listItemElement = document.createElement("li");
	listItemElement.className = "task-item";
	listItemElement.textContent = "This is a new task";
	tasksToDoElement.appendChild(listItemElement);
};

var buttonElement = document.querySelector("#save-task");
var tasksToDoElement = document.querySelector("#tasks-to-do");

buttonElement.addEventListener("click", createTaskHandler);





