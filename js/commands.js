var COMMAND_END_CHAR = ';',

	REGEX_CLEAR = /clear/,
	REGEX_ADD_ELEMENT = /(?:add|\+)\s*(\w+)/,
	REGEX_REMOVE_ELEMENT = /remove|-/,
	REGEX_CSS = /([^:]+):([^:]+)/,
	REGEX_EDIT = /edit/;
	REGEX_RESTART = /restart/,

	REGEX_SHOW_ABOUT = /(help|about)/;
	REGEX_SHOW_CODE = /code/;

var registeredCommands = [];

function registerCommand(commandRegex, callback) {
	registerCommand.push({
		regex: commandRegex,
		callback: callback
	});
}

function checkForCommand(input) {
	var command, match;
	for (var i = 0, il = registeredCommands.length; i < il; i++) {
		command = registeredCommands[i];
		if (match = input.match(command.regex)) {
			callback.call(null, match);
			break;
		}
	}
}

var tags = ['!DOCTYPE', 'a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdi', 'bdo', 'big', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'head', 'header', 'hgroup', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark', 'menu', 'menuitem', 'meta', 'meter', 'nav', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'small', 'source', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr']