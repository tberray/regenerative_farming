const express = require('express');
const models = require('../sequelize/models/index')
const XLSX = require('xlsx')
const router = express.Router();
const fs = require('fs');
const ObjectsToCsv = require('objects-to-csv');
let soilDataJSON = [{"FieldId":"", "pH":"", "nitrate":"", "phosphorus":"", 
	"potassium":"", "tempterature":"", "pctCo2":"", "infiltration":"", 
	"blkDensity":"", "conductivity":"", "aggStability":"", "slakingRating":"", 
	"earthwormCount":"", "penResistance": ""}];

module.exports = (params) => {
	const {checkNotAuthenticated, checkAuthenticated, isAuthenticated, pool, passport, bcrypt} = params;

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
		let allNull = true;
		
		for (let j in i) {
			// console.log(i[j]);
			i[j] = i[j] === '' ? null : i[j];
		}

		for (let j in i) {
			if (i[j] === null)
				continue;

			const value = Number(i[j]);
			if (!isNaN(value)) {
				i[j] = value;
				if (j !== "field") {
					console.log(j);
					allNull = false;
				}
			}
			else {
				req.flash("message", `Error: ${j} must be a number`);
				res.redirect("/users/datainput");
			}
		}

		if (allNull) {
			req.flash("message", "Error: you must enter at least one valid data point");
			res.redirect("/users/datainput");
		}
		else {
			models.SoilEntry.create({FieldId:i.field, pH:i.ph, nitrate:i.nitrogen, phosphorus:i.phosphorus, 
				potassium:i.potassium, tempterature:i.temperature, pctCo2:i.co2, infiltration:i.infiltration, 
				blkDensity:i.bulkDensity, conductivity:i.conductivity, aggStability:i.stability, slakingRating:i.slaking, 
				earthwormCount:i.earthworms, penResistance:i.penetrationResist});
			
			soilDataJSON = [{FieldId:i.field, pH:i.ph, nitrate:i.nitrogen, phosphorus:i.phosphorus, 
				potassium:i.potassium, tempterature:i.temperature, pctCo2:i.co2, infiltration:i.infiltration, 
				blkDensity:i.bulkDensity, conductivity:i.conductivity, aggStability:i.stability, slakingRating:i.slaking, 
				earthwormCount:i.earthworms, penResistance:i.penetrationResist}];
			req.flash("message", "Success!");

			res.redirect("/users/datainput"); // temporary
		}
	});

	router.get("/resources", isAuthenticated, (req, res)=> {
		res.render("resources");
	});

	router.get("/about", isAuthenticated, (req, res)=> {
		res.render("about");
	});

	// not needed but you can use if you want to test something
	router.get("/test", isAuthenticated, (req, res)=> {
		res.render("test");
	});

	router.get("/confirmation-page", isAuthenticated, (req, res)=> {
		res.render("confirmation-page");
	});

	router.get("/terms-info", isAuthenticated, (req, res)=> {
		res.render("terms-info");
	});

	router.get("/field-input", checkNotAuthenticated, (req, res)=> {
		res.render("field-input");
	});

	router.post("/field-input",(req, res) =>{
		var user_id = req.user.id;
		let {fieldname, address, acreage} = req.body;
		if (isNaN(Number(acreage))) {
			req.flash("errors", "Error: acreage must be a number");
			res.render("field-input");
		}
		req.flash("message", "Success!");
		models.Field.create({UserId:user_id, address:address,size:acreage});
		res.redirect("/users/datainput");
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

	router.get("/downloadCSV", isAuthenticated, async(req, res)=> {
		const csv = new ObjectsToCsv(soilDataJSON);
		await csv.toDisk('./data.csv')
		res.download("./data.csv", () => {
			fs.unlinkSync("./data.csv")
		})
	});

	router.get("/downloadExcel", isAuthenticated, async(req, res)=> {
		
		const workSheet = XLSX.utils.json_to_sheet(soilDataJSON);
    	const workBook = XLSX.utils.book_new();

    	XLSX.utils.book_append_sheet(workBook, workSheet, "testOutput");
    	//Generate buffer

    	XLSX.write(workBook, {bookType:'xlsx', type:'buffer'});

    	//Binary string
    	XLSX.write(workBook, {bookType:'xlsx', type:'binary'});
    	XLSX.writeFile(workBook, 'outputData.xlsx');

		res.download("./outputData.xlsx", () => {
			fs.unlinkSync("./outputData.xlsx");
		});

	});
	return router;
}
