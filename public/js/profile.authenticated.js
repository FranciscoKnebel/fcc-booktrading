$('.message .close').on('click', function () {
	$(this).closest('.message').transition('fade');
});

$('.ui.accordion').accordion({exclusive: false});

$('#imgdim').dimmer({on: 'hover'});
