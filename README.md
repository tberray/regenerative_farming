# regenerative_farming
regenerative farming webapp
should be able to run 'npm init' in terminal to add required modules
run 'npm run dev' to run project then open 'http://localhost:4000' in browser

To connnect to db, go to /sequelize/config and set your server login info (might need to make a new db)
- use "host": "127.0.0.1", "dialect": "postgres" and set username, password, and database
Run 'npm install -g sequelize-cli' from the main folder
then run 'sequelize db:migrate' in the sequelize folder
