$('.message .close').on('click', function () {
	$(this).closest('.message').transition('fade');
});

$('.ui.accordion').accordion({exclusive: false});

$('#imgdim').dimmer({on: 'hover'});

function checkWidth(init) {
	/*If browser resized, check width again */
	if ($(window).width() < 768) {
		$('#imgdim').addClass('small').removeClass('medium');
	} else {
		if (!init) {
			$('#imgdim').removeClass('small').addClass('medium');
		}
	}
}

$(document).ready(function () {
	checkWidth(true);

	$(window).resize(function () {
		checkWidth(false);
	});
});
