const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const models = require("./sequelize/models")

function initialize (passport) {
    const authenticateUser = (email, password, done)=> {
        models.User.findAll({    
            where: {
            email: email
          }
        }).catch(error =>{
            if(error) {
                throw error;
            }
        }).then((users) => {
            console.log(users)
            if(users !== undefined && users.length > 0) {
                const user = users[0];
                bcrypt.compare(password, user.password, (err, isMatch)=>{
                    if(err) {
                        throw err
                    }
                    if(isMatch) {
                        return done(null, user);
                    } else {
                        return done(null, false, {message: "Password is not correct" });
                    }
                });
            } else {
                return done(null, false, {message: "Email is not registered"}); 
            }
        });
    }

    passport.use(
        new LocalStrategy(
            {
                usernameField: "email",
                passwordField: "password"
            }, 
            authenticateUser
        )
    );

    passport.serializeUser((user, done)=> done(null, user.id));

    passport.deserializeUser((id, done)=>{
        models.User.findAll({ where: {id: id} }).catch(error =>{
            if(error) {
                throw error;
            }
        }).then((users) => {
            return done(null, users[0]);
        });
    });
}

module.exports = initialize;
