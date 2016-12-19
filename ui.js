function showEl(el, class) {
	var duration = parseFloat(window.getComputedStyle($0).transitionDuration);
	if (duration) {
		setTimeout(function() {
			$(el).removeClass();
		}, duration * 1000);
	}
}