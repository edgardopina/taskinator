/*** Global variables ***/
var formElement = document.querySelector("#task-form"); // <form> element
var tasksToDoElement = document.querySelector("#tasks-to-do"); // "To Do" column, <ul>element
var tasksInProgressElement = document.querySelector("#tasks-in-progress"); // "In Progress" column, <ul> element
var tasksCompletedElement = document.querySelector("#tasks-completed"); // "Complete" column, <ul> element
var pageContentElement = document.querySelector("#page-content"); // <main> element
var tasksPersistance = []; // array of tasks for persistance to local storage
var taskIdCounter = 0; // unique task id

// loadTasks: recovers taskinator data from localStorage and restores taskinator state
var loadTasks = function () {
	var savedTasks = localStorage.getItem("taskinatorTasks"); // recovers tasks from localStorage
	// validates for non-existing key
	if (savedTasks === null) {
		return false;
	}

	savedTasks = JSON.parse(savedTasks); // parse data into array (based on data structure recovered from localStorage)

	// the actual Taskinator's restore from localStorage/memory to DOM
	for (var i = 0; i < savedTasks.length; ++i) {
		createTaskElement(savedTasks[i]); // calls createTaskElement() for each task array element
	}
};

// saveTasks: persists Taskinator's DOM to localStorage
// JSON.stringify MUST BE USED
var saveTasks = function () {
	localStorage.setItem("taskinatorTasks", JSON.stringify(tasksPersistance));
};

// taskStatusChangeHandler: moves one task from one column to another
// event: the event that triggered the eventListener
// event.target: the element upon which the event happenned
var taskStatusChangeHandler = function (event) {
	var taskId = event.target.getAttribute("data-task-id"); // get the task's Id
	var statusValue = event.target.value.toLowerCase(); // currently selected option's value to lowercase to compare

	var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']"); // gets selected task

	// reclassifies to new column based on select option
	// appendChild creates child or "moves" current child to another parent node
	if (statusValue === "to do") {
		tasksToDoElement.appendChild(taskSelected);
	} else if (statusValue === "in progress") {
		tasksInProgressElement.appendChild(taskSelected);
	} else if (statusValue === "completed") {
		tasksCompletedElement.appendChild(taskSelected);
	}

	// update status (column) in tasksPersistance array for matching tasks (=== condition)
	// NOTE parseInt
	for (var i = 0; i < tasksPersistance.length; ++i) {
		if (tasksPersistance[i].id === parseInt(taskId)) {
			tasksPersistance[i].status = statusValue;
		}
	}

	saveTasks(); // persists taskinator to localStorage
};

// completeEdittask: performs the actual data update
var completeEditTask = function (taskName, taskType, taskId) {
	var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']"); // gets actual task

	taskSelected.querySelector("h3.task-name").textContent = taskName; // updates taskName value
	taskSelected.querySelector("span.task-type").textContent = taskType; // updates taskType value

	// loops through tasksPersistance array to update MATCHING persisted task with new/updated content
	// NOTE that status is not processed here but in other section as this updat does not include column update
	for (var i = 0; i < tasksPersistance.length; ++i) {
		if (tasksPersistance[i].id === parseInt(taskId)) {
			tasksPersistance[i].name = taskName;
			tasksPersistance[i].type = taskType;
		}
	}

	formElement.removeAttribute("data-task-id"); // reset add/edit processing flag by removing atribute from form element
	document.querySelector("#save-task").textContent = "Add Task"; // restores button content from "Save Task" to "Add Task"

	saveTasks(); // persists taskinator to localStorage
	window.alert("Task updated!"); // confirmation to user
};

// editTask: handler to processes click on Edit button
// recived taskId from button handler
var editTask = function (taskId) {
	var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']"); // gets taskSelectd

	var taskName = taskSelected.querySelector("h3.task-name").textContent; // get task name
	document.querySelector("input[name='task-name']").value = taskName; // displays current task name in input field

	var taskType = taskSelected.querySelector("span.task-type").textContent; // get task type
	document.querySelector("select[name='task-type']").value = taskType; // displays current task type in input field

	document.querySelector("#save-task").textContent = "Save Task"; // updates button from "Add Task" to "Save Task"

	formElement.setAttribute("data-task-id", taskId); // sets form flag with taskId of task being processed with Edit
};

// deleteTask: handler to processes click on Delete button
// recived taskId from button handler
var deleteTask = function (taskId) {
	var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

	taskSelected.remove(); // delete task

	var updatedTaskArr = []; // create new array to hold updated list of tasks

	//loop through current tasks
	for (let i = 0; i < tasksPersistance.length; ++i) {
		// matched value of ids is for deleted task, NO match indicates we must keep that task
		if (tasksPersistance[i].id !== parseInt(taskId)) {
			updatedTaskArr.push(tasksPersistance[i]);
		}
	}

	tasksPersistance = updatedTaskArr; // reassign tasks array to be the same as updatedTaskArr

	saveTasks(); // persists taskinator to localStorage
};

// taskButtonHandler: handler for eventlistene "click" on button on pageContentElement (the <main> element)
var taskButtonHandler = function (event) {
	var targetElement = event.target; // get target element from event (who got the event - click -)
	var taskId = targetElement.getAttribute("data-task-id"); // get the element's task Id

	// selects "sub" handler based on button clicked-on
	if (targetElement.matches(".edit-btn")) {
		editTask(taskId);
	} else if (targetElement.matches(".delete-btn")) {
		deleteTask(taskId);
	}
};

// createTaskActions:
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

	var statusChoices = ["", "To Do", "In Progress", "Completed"]; // adds options to empty select

	var statusChoicesLength = statusChoices.length;
	for (var i = 0; i < statusChoicesLength; i++) {
		var statusOptionElement = document.createElement("option"); // create option element
		statusOptionElement.setAttribute("value", statusChoices[i]);
		if (i === 0) {
			statusOptionElement.textContent = "Pick A Column";
			statusOptionElement.setAttribute("disabled", "true");
			statusOptionElement.setAttribute("selected", "true");
		} else {
			statusOptionElement.textContent = statusChoices[i];
		}

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

	//adds list item to its corresponding column
	if (taskDataObj.status === "to do") {
		tasksToDoElement.appendChild(listItemElement);
	} else if (taskDataObj.status === "in progress") {
		tasksInProgressElement.appendChild(listItemElement);
	} else if (taskDataObj.status === "completed") {
		tasksCompletedElement.appendChild(listItemElement);
	}

	taskDataObj.id = taskIdCounter; // adds task Id to task object
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

	// formElement.reset(); // resets form element

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
		formElement.reset(); // resets form element
	}
};

loadTasks();

formElement.addEventListener("submit", taskFormHandler);

pageContentElement.addEventListener("click", taskButtonHandler);

pageContentElement.addEventListener("change", taskStatusChangeHandler);
