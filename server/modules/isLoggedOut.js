module.exports = function (req, res, next) {
	if (req.isUnauthenticated()) {
		return next();
	} else {
		res.redirect('/');
	}
};
