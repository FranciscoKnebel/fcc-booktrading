$('.message .close').on('click', function () {
	$(this).closest('.message').transition('fade');
});

$('.ui.accordion').accordion({exclusive: false});
$('.ui.checkbox').checkbox();
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

function deleteBook(bookID) {
	if (confirm("Are you sure you want to delete this?")) {
		console.log(bookID);
		$.ajax({
			type: "DELETE",
			url: "/profile/delete/book/" + bookID
		}).done(function (res) {
			if (res === true) {
				var card = $('#' + bookID);
				card.transition({
					animation: 'fade out',
					onComplete: function () {
						var bookslabel = parseInt($('#bookslength').text().replace(/[^0-9\.]/g, ''), 10);

						$('#bookslength').empty();
						$('#bookslength').append(--bookslabel);

						card.remove();
					}
				});
			} else {
				alert(res);
			}
		});
	}
}

$(document).ready(function () {
	checkWidth(true);

	$(window).resize(function () {
		checkWidth(false);
	});
});
