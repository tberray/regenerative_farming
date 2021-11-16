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

	router.get("/dashboard", async (req, res) => {
		let users = await models.User.findAll();
		let fields = await models.Field.findAll();
		let soilEntries = await models.SoilEntry.findAll();
		res.render("admin-dashboard", {
			users,
			fields,
			soilEntries,
		});
	});

	return router;
}