
var currentKbdInput = '',
	matchingCommand = '',
	selectedEl = null,
	styleSheet,
	rules = {},
	MAX_HISTORY_SIZE = 300,
	commandHistory = ['padding: ', 'margin: ', 'color: ', 'border: '],
	defaultCommands = ['edit', 'add div', 'remove', 'restart', 'code'];

var commandEl = document.querySelector('#js-command'),
	commandSuggestionEl = document.querySelector('#js-command-suggestion'),
	codeWrapEl = document.querySelector('#js-code-wrap'),
	htmlCodeEl = document.querySelector('#js-html-code'),
	cssCodeEl = document.querySelector('#js-css-code');

function handleKbdCommands () {
	var match;

	// Strip COMMAND_END_CHAR from end.
	// currentKbdInput = currentKbdInput.substring(0, currentKbdInput.length - 1);

	if (match = currentKbdInput.match(REGEX_CLEAR)) {}

	else if (match = currentKbdInput.match(REGEX_EDIT)) {
		edit(selectedEl);
	}

	else if (match = currentKbdInput.match(REGEX_CSS)) {
		addCSS(selectedEl, match[1], match[2]);
	}

	else if (match = currentKbdInput.match(REGEX_ADD_ELEMENT)) {
		addElement(match[1], selectedEl);
	}

	else if (match = currentKbdInput.match(REGEX_REMOVE_ELEMENT)) {
		removeElement(selectedEl);
	}

	else if (match = currentKbdInput.match(REGEX_RESTART)) {
		restart();
	}
	else if (match = currentKbdInput.match(REGEX_SHOW_CODE)) {
		showCode();
	}
}

function restart() {
	// Remove all expect first child in BODY. Its out UI.
	var children = [].slice.call(document.body.children, 1);
	$(children).remove();

	selectedEl = null;
}

function addElement(tag, insideWhat, html) {
	tag = tag || 'div';
	insideWhat = insideWhat || document.body;
	html = html || 'New ' + tag.toUpperCase();

	var el = document.createElement(tag);
	el.innerHTML = html;
	insideWhat.appendChild(el);

	if (!selectedEl) {
		selectElement(el);
	}
}

function removeElement(el) {
	if (!el) return;
	var parentNode = el.parentNode;
	if (selectedEl === el) {
		selectElement(parentNode);
	}
	parentNode.removeChild(el);
}

function addCSS(el, prop, value) {
	if (!el || !prop || !value) return;

	var firstClass = el.classList[0],
		rule;

	$(selectedEl).css(prop, value);
}

function edit(el) {
	// Un-edit current element being edited.
	var elementBeingEdited = $('[contentEditable=true]').get(0);
	if (elementBeingEdited) {
		elementBeingEdited.contentEditable = false;
	}

	if (!el) return;

	// HACK to ignore last keypress from getting inserted
	setTimeout(function () {
		el.contentEditable = true;
		el.focus();
	}, 10);
}

function selectElement(el) {
	if (selectedEl) {
		selectedEl.classList.remove('is-selected');
	}
	selectedEl = el;
	selectElement.contentEditable = false;
	selectedEl.classList.add('is-selected');
}

function navigate(arrow) {
	if (!selectedEl || isElementBeingEdited()) return;
	// left/right - sibling traversal
	// up/down - parent/child traversal

	// Left & right
	if (arrow === 37 && selectedEl.previousElementSibling && selectedEl.previousElementSibling !== document.body.children[0]) {
		selectElement(selectedEl.previousElementSibling);
	}
	else if (arrow === 39 && selectedEl.nextElementSibling) {
		selectElement(selectedEl.nextElementSibling);
	}
	// Up & down
	else if (arrow === 38 && selectedEl.parentNode && selectedEl.parentNode != document.body) {
		selectElement(selectedEl.parentNode);
	}
	else if (arrow === 40 && selectedEl.children.length) {
		selectElement(selectedEl.children[0]);
	}
}

function isElementBeingEdited () {
	if (selectedEl && selectedEl.contentEditable === 'true') return true;
	return false;
}

function updateCommandUI() {
	matchingCommand = getBestMatchingCommandFromHistory(currentKbdInput);

	// commandEl.value = currentKbdInput;
	commandSuggestionEl.value = (matchingCommand || '');
}

function addToHistory(command) {
	commandHistory.push(command);
	if (commandHistory.length > MAX_HISTORY_SIZE) {
		commandHistory.splice(0, 1);
	}
}


// Returns lastest that starts with the passed `command`.
function getBestMatchingCommandFromHistory(command) {
	if (!command) return false;
	var commandRegex = new RegExp('^' + escapeForRegex(command));

	for (var i = commandHistory.length; i--;) {
		if (commandRegex.test(commandHistory[i])) {
			return commandHistory[i];
		}
	}
	for (var i = defaultCommands.length; i--;) {
		if (commandRegex.test(defaultCommands[i])) {
			return defaultCommands[i];
		}
	}
}

function escapeForRegex(str) {
	return str.replace(/(\(|\)|\+|=|\[)/g, '\\$1');
}
function escapeHTML(html) {
	return html.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function cleanHTML(html) {
	return html.replace(/is-selected/g, '');
}

function showCode() {
	// Get all <body> children except last one.
	var bodyChildren = Array.prototype.slice.call(document.body.children, 1);
	var allHtml = bodyChildren.reduce(function reduceCallback(html, el) {
		return el.outerHTML + html;
	}, '');
	allHtml = cleanHTML(allHtml);

	$(codeWrapEl).find('code').html(escapeHTML(allHtml));
	Prism.highlightAll()

	codeWrapEl.classList.add('show');
}

function hideCode() {
	codeWrapEl.classList.remove('show')
}

function onKeyPress(e, character) {
	// Don't record keypresses when editing something.
	if (isElementBeingEdited()) return;

	var c = character || String.fromCharCode(e.which).toLowerCase();
	currentKbdInput = commandEl.value;

	// remove ; from end
	if (c === COMMAND_END_CHAR) {
		// currentKbdInput = currentKbdInput.substring(0, currentKbdInput.length - 1);
	}
	if (c === COMMAND_END_CHAR || e.which === 13) {
		handleKbdCommands();
		addToHistory(currentKbdInput);
		currentKbdInput = '';
		commandEl.value = currentKbdInput;
	}

	updateCommandUI();
}

function onKeyDown(e) {
	// Tab key selects the current suggestion, if any.
	if (e.which === 9) {
		e.preventDefault();
		if (!matchingCommand) return;
		currentKbdInput = matchingCommand;
		commandEl.value = currentKbdInput;
		updateCommandUI();
	}
}

function onKeyUp(e) {
		// Escape key
	if (e.which === 27) {
		edit(null); // Unedit current element.
		hideCode();
		commandEl.focus();
	}
	// Arrow keys navigate the DOM...only if user isn't typing any command
	else if ({37: 1, 38: 1, 39: 1, 40: 1}[e.which] && !commandEl.value) {
		navigate(e.which);
	}

	updateCommandUI();
}

function onMouseClick(e) {
	var target = e.target;
	if (!target || target.tagName.toLowerCase() === 'body' || target.tagName.toLowerCase() === 'html') return;

	selectElement(target);
}

function init() {
	var style = document.createElement('style');
	style.type = 'text/css';
	// WebKit hack :(
	style.appendChild(document.createTextNode(""));
	document.head.appendChild(style);
	styleSheet = style.sheet;

	superplaceholder({
		el: commandEl,
		sentences: [ 'Type in commands to create HTML', 'add div', 'border: 2px solid;'],
		options: {
			letterDelay: 80,
			loop: true,
		}
	});

	document.addEventListener('keypress', onKeyPress);
	document.addEventListener('keydown', onKeyDown);
	document.addEventListener('keyup', onKeyUp);
	document.body.classList.add('is-loaded');
	//window.addEventListener('click', onMouseClick);
}

function log() {
	if (window.DEBUG === false) return;
	console.log.apply(console, [].splice.call(arguments, 0));
}

window.addEventListener('load', function onLoad() {
	init();
})
