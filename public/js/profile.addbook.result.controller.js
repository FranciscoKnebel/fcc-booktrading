var app = angular.module('addbook', []);

app.controller('addbookController', function ($scope, $http, $location) {
	$scope.books = [];
	$scope.remaining = window.remaining;

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
		$http.post('', $scope.books).then(function (response) {}, function (response) {});
	}

	$scope.sendSingleBook = function () {
		$http.post('', $scope.books).then(function (response) {}, function (response) {});
	}

});

function lastBook(remaining) {
	if (remaining === 0) {
		angular.element(document).find('#alldone').transition('scale in');
	}
}