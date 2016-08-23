function uncheck() {
	$('#customCheckbox').prop('checked', false);
	$('#notcustomCheckbox').prop('checked', true);
}

function formtype() {
	if ($('#customCheckbox').prop('checked')) {
		$('#notcustomCheckbox').prop('checked', false);
		$('#googleBooks').hide();
		$('#customBook').fadeIn();
		$('#form').removeClass('very padded piled').removeClass('stacked');
	} else {
		$('#notcustomCheckbox').prop('checked', true);
		$('#customBook').hide();
		$('#googleBooks').fadeIn();
		$('#form').removeClass('very padded piled').addClass('stacked');
	}
}

$(document).ready(function () {
	$('.ui.checkbox').checkbox();
	$('#customBook').hide();
	$('#notcustomCheckbox').hide();

	$('#custom').click(function () {
		formtype();
	});

	$('#notcustom').click(function () {
		formtype();
	});

	$('.ui.secondary.reset.button').click(function () {
		uncheck();
		$('#customBook').hide();
		$('#googleBooks').fadeIn();
		$('#form').removeClass('very padded piled').addClass('stacked');
	});

	$('#form').form({
		on: 'blur',
		fields: {
			query: {
				identifier: 'query',
				depends: 'notcustom',
				rules: [
					{
						type: 'empty',
						prompt: 'Query field is empty.'
					}
				]
			},
			title: {
				identifier: 'title',
				depends: 'custom',
				rules: [
					{
						type: 'empty',
						prompt: 'Title field is empty.'
					}, {
						type: 'maxLength[50]',
						prompt: 'Please enter at most 50 characters'
					}
				]
			},
			author: {
				identifier: 'author',
				depends: 'custom',
				rules: [
					{
						type: 'empty',
						prompt: 'Author field is empty.'
					}, {
						type: 'maxLength[50]',
						prompt: 'Please enter at most 50 characters'
					}
				]
			},
			description: {
				identifier: 'description',
				depends: 'custom',
				rules: [
					{
						type: 'empty',
						prompt: 'Description field is empty.'
					}, {
						type: 'maxLength[200]',
						prompt: 'Please enter at most 200 characters'
					}
				]
			},
			pageCount: {
				identifier: 'pageCount',
				optional: true,
				depends: 'custom',
				rules: [
					{
						type: 'empty',
						prompt: 'Page count field is empty.'
					}, {
						type: 'number',
						prompt: 'Please enter a valid number'
					}
				]
			},
			thumbnail: {
				identifier: 'thumbnail',
				depends: 'custom',
				optional: true,
				rules: [
					{
						type: 'empty',
						prompt: 'Thumbnail field is empty.'
					}, {
						type: 'url',
						prompt: 'Please enter a valid url'
					}
				]
			}
		},
		inline: true
	});
});
