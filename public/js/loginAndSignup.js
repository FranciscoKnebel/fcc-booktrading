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
