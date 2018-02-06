# projectAY-musical-broccoli

### Project description
...
### Installation
#### Node modules
Run `npm install`
#### Database
1. Create `config.json` file in `/database/config`
2. Set config file with database connection informations
3. Create the database tables with : 
`sequelize db:migrate`
4. Create default database data with : 
`node database/creationScripts/generateInitialEntries.js`

### Running procedure 
1. Run `node server_services/main_service/server.js`
2. Run `node clientServer.js`
3. Open `localhost:8000` in a browser
