const express = require('express');
// const app = express();
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const makeApp = require("./app")

const initializePassport = require("./passportConfig");

const app = makeApp(bcrypt, session, flash, passport, initializePassport);
const PORT = process.env.PORT || 4000;

// listen on a port (4000)
app.listen(PORT, ()=> {
	console.log(`Server running on port ${PORT}`);
})
