const express = require('express');

const usersRoute = require('./users');
const adminRoute = require('./admin');

const router = express.Router();

module.exports = (params) => {
	
	router.get('/', (req, res) => {
		res.render('index');
	});

	router.use("/users", usersRoute(params));

	router.use("/admin", adminRoute(params));

	return router;
}
