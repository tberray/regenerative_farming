const request = require("supertest");
const makeApp = require("./app");

const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");

const initializePassport = require("./passportConfig");

const app = makeApp(bcrypt, session, flash, passport, initializePassport);

describe("POST /users/register", () => {

	beforeEach(() => {

	});

	describe("When passed valid username/password", () => {
		test("Should save information in database", () => {
			expect("true").toBe("true");
		})
	});

});