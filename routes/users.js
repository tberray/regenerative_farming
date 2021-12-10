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
		//res.render("test", {user: req.user.name });
		models.Field.findAll({where: {UserId:req.user.id}}).catch(error =>{
			if(error) {
				throw error;
			}
		}).then((fields) => {
			res.render("dashboard", {
				"fields": fields, // placeholder
				user: req.user.name
			});
		});
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

			res.redirect("/users/confirmation-page"); // temporary
		}
	});

	router.get("/resources", isAuthenticated, (req, res)=> {
		res.render("resources");
	});

	router.get("/about", isAuthenticated, (req, res)=> {
		res.render("about");
	});

	router.get("/about-us", isAuthenticated, (req, res)=> {
		res.render("about-us");
	});

	router.get("/cover-crops", isAuthenticated, (req, res)=> {
		res.render("cover-crops");
	});

	// not needed but you can use if you want to test something
	/*router.get("/test", isAuthenticated, (req, res)=> {
		//res.render("test", {user: req.user.name });
		models.Field.findAll({where: {UserId:req.user.id}}).catch(error =>{
			if(error) {
				throw error;
			}
		}).then((fields) => {
			res.render("test", {
				"fields": fields, // placeholder
				user: req.user.name
			});
		});
	});
	*/

	router.get("/confirmation-page", isAuthenticated, (req, res)=> {
		res.render("confirmation-page");
	});

	router.get("/terms-info", isAuthenticated, (req, res)=> {
		res.render("terms-info");
	});

	router.get("/field-input", checkNotAuthenticated, (req, res)=> {
		res.render("field-input");
	});

	router.get("/enter-data", checkNotAuthenticated, (req, res)=> {
		res.render("enter-data");
	});

	router.post("/field-input",(req, res) =>{
		var user_id = req.user.id;
		let {address, acreage} = req.body;
		
		if (acreage === "" || address === "") {
			var errors = [];
			if(acreage === "") {
				errors.push("Error: acreage must not be empty")
			}
			if(address === "") {
				errors.push("Error: address must not be empty")
			}
			req.flash("errors", errors);
			res.redirect("field-input");
		} else {
			req.flash("message", "Success!");
			models.Field.create({UserId:user_id, address:address,size:acreage});
			res.redirect("/users/confirmation-page");
		}
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
		}
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
	});
	
	router.post(
		"/login", (req, res, next) => {
			req.session.email = req.body.email;
			next();
		},
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
		let {oldPass, newPass, newPassConfirm}  = req.body;

		if (!req.session.email)
		{
			res.redirect("/logout");
		}

		if (!oldPass || !newPass || !newPassConfirm)
		{
			let error = "Please enter all fields";
			res.render("account", { error })
		}

		if (newPass !== newPassConfirm)
		{
			let error = "Error: passwords do not match";
			res.render("account", { error });
		}

		models.User.findAll({where: {
			email: req.session.email
		}}).catch(() => {
			res.redirect("/logout");
		}).then(async users => {
			if (users !== undefined && users.length === 1)
			{
				let user = users[0];
				let error = undefined;
				await bcrypt.compare(oldPass, user.password, (err, isMatch) => {
					if (!isMatch)
					{
						let error = "Error: old password is incorrect";
						res.render("account", { error });
					}
					else
					{
						res.render("account", {message: "Success!"});
					}
				});
			}
		});

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
