var app = angular.module('addbook', []);
var sentSingleBookAlready = false;

app.controller('addbookController', function ($scope, $http, $location) {
	var message = angular.element(document).find('.message');

	$scope.books = [];
	$scope.remaining = window.remaining;
	$scope.message = "";

	$scope.addBook = function (id) {
		if ($scope.books.indexOf(id) === -1) {
			var card = angular.element(document).find('#' + id);
			$scope.books.push(id);
			$scope.remaining--;

			card.transition({
				animation: 'scale',
				onComplete: function () {
					card.remove();
					lastBook($scope.remaining);
				}
			});
		}
	};

	$scope.removeBook = function (id) {
		var card = angular.element(document).find('#' + id);
		$scope.remaining--;

		card.transition({
			animation: 'scale',
			onComplete: function () {
				card.remove();
				lastBook($scope.remaining);
			}
		});
	};

	$scope.submitBooks = function () {
		if ($scope.books.length >= 1) {
			$http.post('/profile/add/book/approve', $scope.books).then(function (response) {
				$scope.message = response.data;
				message.transition('fade in');
				$scope.books = [];
			}, function (response) {
				$scope.message = response.data;
				message.transition('fade in');
			});
		} else {
			$scope.message = "You need to add at least one book.";
			message.transition('fade in');
		}
	}

	$scope.sendSingleBook = function () {
		if ($scope.books.length === 1) {
			$http.post('/profile/add/book/approve', $scope.books).then(function (response) {
				$scope.message = response.data;
				message.transition('fade in');
				$scope.books = [];
				sentSingleBookAlready = true;
			}, function (response) {
				$scope.message = response.data;
				message.transition('fade in');
			});
		} else if (sentSingleBookAlready) {
			$scope.message = "You already sent your custom book.";
			message.transition('fade in');
		} else {
			$scope.message = "You need to confirm the book addition.";
			message.transition('fade in');
		}
	}

	$scope.closeMessage = function () {
		message.transition({
			animation: 'fade out',
			onComplete: function () {
				$scope.message = "";
			}
		});
	}
});

function lastBook(remaining) {
	if (remaining === 0) {
		angular.element(document).find('#alldone').transition('scale in');
	}
}
