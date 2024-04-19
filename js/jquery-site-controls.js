$(document).ready(function() {
	$('.fa').click(function() {
		window.location = window.location.href.replace(/[^\/]+\.html.*$/,"");
	});
});