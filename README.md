# regenerative_farming
regenerative farming webapp
# For Testing:
Go to regenapp.ddns.net:53211

# For dev:
run `npm install` when pulling a new version

To connnect to db, go to /sequelize/config and set your server login info (might need to make a new db)
- use "host": "127.0.0.1", "dialect": "postgres" and set username, password, and database
Run 'npm install -g sequelize-cli' from the main folder
then run 'sequelize db:migrate' in the sequelize folder
