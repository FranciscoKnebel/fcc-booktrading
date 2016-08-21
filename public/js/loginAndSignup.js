$("#loginButton").click(function () {
	var modal = $("#authModal");

	modal.find('.header').text('Log In');
	modal.find('#authForm').attr('action', "/login");
	$('#authModal').modal('show');
});

$("#signupButton").click(function () {
	var modal = $("#authModal");

	modal.find('.header').text('Signup');
	modal.find('#authForm').attr('action', "/signup");
	$('#authModal').modal('show');
});

$('#authForm').form({
	on: 'blur',
	fields: {
		email: {
			identifier: 'email',
			rules: [
				{
					type: 'empty',
					prompt: 'E-mail field is empty.'
				}, {
					type: 'email',
					prompt: 'Please enter a valid e-mail.'
				}
			]
		},
		password: {
			identifier: 'password',
			rules: [
				{
					type: 'empty',
					prompt: 'Password field is empty.'
				}, {
					type: 'minLength[6]',
					prompt: "Minimum password length is 6."
				}
			]
		}
	},
	inline: true
});
