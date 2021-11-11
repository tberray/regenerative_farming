const express = require('express');
const models = require('../sequelize/models/index')

const router = express.Router();

module.exports = (params) => {
	router.get("/", (req, res) => {
		res.redirect("/admin/login");
	});

	router.get("/login", (req, res) => {
		res.render("admin-login");
	});

	router.post("/login", (req, res) => {
		res.render("admin-login");
	});

	router.get("/dashboard", (req, res) => {
		res.render("admin-dashboard");
	})

	return router;
}