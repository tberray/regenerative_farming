const express = require('express');
const models = require('../sequelize/models/index')

const router = express.Router();

module.exports = (params) => {
	const {checkNotAuthenticated, checkAuthenticated, pool, passport, bcrypt} = params;

	router.get("/register", checkAuthenticated, (req, res)=> {
		res.render("register");
	});
	
	router.get("/login", checkAuthenticated, (req, res)=> {
		res.render("login");
	});
	
	router.get("/dashboard", checkNotAuthenticated, (req, res)=> {
		res.render("dashboard", {user: req.user.name });
	});

	router.get("/datainput", checkNotAuthenticated, (req, res)=> {
		res.render("datainput", {
			"fields": ["Field1", "Field2", "Field3"], // placeholder
		});
	});

	router.post("/datainput", checkNotAuthenticated, (req, res) => {
		let  i = { field, ph, nitrogen, phosphorus, potassium, temperature, forc, co2, infiltration, bulkDensity, conductivity, stability, slaking, earthworms, penetrationResist } = req.body;
		for (let j in i)
			i[j] = i[j] === '' ? null : i[j];

		

		res.redirect("/users/dashboard"); // temporary
	});

	router.get("/resources", (req, res)=> {
		res.render("resources");
	});

	router.get("/about", (req, res)=> {
		res.render("about");
	});

	router.get("/test", (req, res)=> {
		res.render("test");
	});
	
	router.get("/logout", (req, res)=>{
		req.logOut();
		req.flash("success_msg", "You have been logged out");
		res.redirect("/users/login");
	});
	
	router.post("/register", (req, res)=> {
		let { name, email, password, password2 } = req.body;
		console.log(name, email, password, password2);
	
		let errors = [];
	
		if (!name || !email || !password || !password2) {
			errors.push({message: "Please enter all fields" });
		}
	
		if (password.length < 6) {
			errors.push({message: "Password should be at least 6 characters" });
		}
	
		if (password != password2) {
			errors.push({message: "Passwords do not match" });
		}
	
		if(errors.length > 0) {
			res.render("register", { errors });
		} else {
			// form validation has passed

			models.User.findAll().catch(error =>{
				if(error) {
					throw error;
				}
			}).then((users) => {
				// console.log(users)
				if(users.length > 0) {
					errors.push({message: "Email already registered"});
					res.render("register", { errors })
				} else {
					(async() => {
						let hashedPassword = await bcrypt.hash(password, 10);
						models.User.create({ name: name, email: email, password: hashedPassword }).then((user) => {
							// console.log(user);
						}).catch(error => {
							if(error) {
								throw error;
							}
						});
					})();
					
					//TODO check for error thrown
					req.flash("success_msg", "You are now registered. Please log in");
					res.redirect("/users/login");
				}
			});
		}
	});
	
	router.post(
		"/login", 
		passport.authenticate("local", {
			successRedirect: "/users/dashboard", 
			failureRedirect: "/users/login", 
			failureFlash: true
		})
	);

	return router;
}
