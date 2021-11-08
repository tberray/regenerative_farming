const express = require('express');
const app = express();
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");


const initializePassport = require("./passportConfig");

initializePassport(passport);

const routes = require("./routes");

const PORT = process.env.PORT || 4000;


app.set("view engine", "ejs");

// middleware to send stuff from front end to database
app.use(express.urlencoded({ extended: false }));

app.use(session({
	secret: "secret", 
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use('/', routes({
	checkAuthenticated,
	checkNotAuthenticated,
	passport,
	bcrypt,
}));


function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return res.redirect("/users/dashboard");
	}
	next();
}

function checkNotAuthenticated(req, res, next) {
	if (req.isAuthenticated()){
		return next()
	}

	res.redirect("/users/login");
}

app.listen(PORT, ()=> {
	console.log(`Server running on port ${PORT}`);
})
