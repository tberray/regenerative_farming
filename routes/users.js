const express = require('express');
const models = require('../sequelize/models/index')

const router = express.Router();

module.exports = (params) => {
	const {checkNotAuthenticated, checkAuthenticated, pool, passport, bcrypt} = params;

	router.get("/", (req, res) => {
		res.redirect("/users/login");
	});

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
		models.Field.findAll({where: {UserId:req.user.id}}).catch(error =>{
			if(error) {
				throw error;
			}
		}).then((fields) => {
			res.render("datainput", {
				"fields": fields, // placeholder
			});
		});
		
	});

	router.post("/datainput", checkNotAuthenticated, (req, res) => {
		let i = req.body;
		
		for (let j in i) {
			console.log(i[j]);
			i[j] = i[j] === '' ? null : Number(i[j]);
		}
		
		models.SoilEntry.create({FieldId:i.field, pH:i.ph, nitrate:i.nitrogen, phosphorus:i.phosphorus, potassium:i.potassium, tempterature:i.temperature, pctCo2:i.co2, infiltration:i.infiltration, blkDensity:i.bulkDensity, conductivity:i.conductivity, aggStability:i.stability, slakingRating:i.slaking, earthwormCount:i.earthworms, penResistance:i.penetrationResist});

		

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

	router.get("/field-input", checkNotAuthenticated, (req, res)=> {
		res.render("field-input");
	});

	router.post("/field-input",(req, res) =>{
		var user_id = req.user.id;
		let {fieldname, address, acreage} = req.body;
		models.Field.create({UserId:user_id, address:address,size:acreage});
		res.redirect("/users/datainput");
	})
	
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

			models.User.findAll({where:{email: email}}).catch(error =>{
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

	router.get("/account", checkNotAuthenticated, (req, res) => {
		res.render("account");
	});

	router.post("/account", checkNotAuthenticated, (req, res) => {
		// TODO: handle account modification.

		res.render("account");
	});

	return router;
}
