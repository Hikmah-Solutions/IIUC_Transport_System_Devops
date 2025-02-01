git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/Hikmah-Solutions/iiuc_transport_systems
git push -u origin main

<!-- PostgressSQL Commands -->
<!-- Shoulde run these commands on backend root directory where package.json located-->
npm install sequelize sequelize-cli
npm install pg pg-hstore
npx sequelize-cli init
npx sequelize-cli migration:generate --name create-admin-users

sequelize: The Sequelize ORM.
sequelize-cli: Command-line tools for Sequelize.
pg: PostgreSQL client for Node.js.
pg-hstore: Required for handling PostgreSQL JSONB data types.


<!-- PostgreSQL -->
setup database.js
also setup the config.js file and add it on index.js
add it on server.js
also add the schema path


<!-- For Create Migration file -->
npx sequelize-cli model:generate --name BusSchedule --attributes scheduleName:string,route:string,startPoint:string,endPoint:string,time:string,scheduleType:enum

npx sequelize-cli db:migrate
