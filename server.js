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

// use ejs for dynamic web pages - pages are in views folder with .ejs extension
app.set("view engine", "ejs");

// middleware to send stuff from front end to database
app.use(express.urlencoded({ extended: false }));

// passport is for saving cookies
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
    isAuthenticated,
	passport,
	bcrypt,
}));

app.use(express.static(__dirname + '/public'));

/*
app.use(express.static(__dirname + '/public'));


// render pages. checkAuthenticated and checkNotAuthenticated are defined below. first argument of get() is the extension to get to that page
app.get('/', (req, res)=> {
    res.render('index');
});

app.get("/users/register", checkAuthenticated, (req, res)=> {
    res.render("register");
});

app.get("/users/login", checkAuthenticated, (req, res)=> {
    res.render("login");
});

app.get("/users/dashboard", checkNotAuthenticated, (req, res)=> {
    res.render("dashboard", {user: req.user.name });
});

app.get("/users/test", (req, res)=> {
    res.render("test");
});

app.get("/users/datainput", (req, res)=> {
    res.render("datainput");
});

// if a user wants to log out, log them out and send them to login page
app.get("/users/logout", (req, res)=>{
    req.logOut();
    req.flash("success_msg", "You have been logged out");
    res.redirect("/users/login");
});

app.post("/users/register", async (req, res)=> {
    let { name, email, password, password2 } = req.body;
    console.log(name, email, password, password2);

    let errors = [];

    // if they don't enter anything in a field, don't let them register
    if (!name || !email || !password || !password2) {
        errors.push({message: "Please enter all fields" });
    }

    // secure passwords should have at least 6 characters
    if (password.length < 6) {
        errors.push({message: "Password should be at least 6 characters" });
    }

    // confirm password must match password
    if (password != password2) {
        errors.push({message: "Passwords do not match" });
    }

    if(errors.length > 0) {
        res.render("register", { errors }); // re-render page with errors displayed in <ul>
    } else {
        // form validation has passed

        // use bcrypt to hash passwords so they are not stored in plaintext in db
        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        // pool is used to access db
        pool.query(
            `SELECT * FROM users
            WHERE email = $1`, [email], (err, results)=>{
                if (err) {
                    throw err
                }
                console.log(results.rows);
                if(results.rows.length > 0) {
                    errors.push({message: "Email already registered"});
                    res.render("register", { errors });
                } else {
                    pool.query(
                        `INSERT INTO users (name, email, password)
                        VALUES ($1, $2, $3)
                        RETURNING id, password`, [name, email, hashedPassword], 
                        (err, results)=>{
                            if (err) {
                                throw err
                            }
                            console.log(results.rows);
                            req.flash("success_msg", "You are now registered. Please log in");
                            res.redirect("/users/login");
                        }
                    );
                }
            }
        );
    }
});

app.post(
    "/users/login", 
    passport.authenticate("local", {
        successRedirect: "/users/dashboard", 
        failureRedirect: "/users/login", 
        failureFlash: true
    })
);
*/
function checkAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		return res.redirect("/users/dashboard");
	}
	next();
}

function checkNotAuthenticated(req, res, next) {
	if (req.isAuthenticated()){
        req.flash("authenticated", true);
		return next()
	}

	res.redirect("/users/login");
}

// used by resources and about page so the navbar works correctly if you are/not logged in
// not sure if every line in here is necessary but it seems to work
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()){
        req.flash("authenticated", true);
        return next()
	}
    next();
}

// listen on a port (4000)
app.listen(PORT, ()=> {
	console.log(`Server running on port ${PORT}`);
})
