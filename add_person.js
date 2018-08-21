console.log('Inserting...');

const settings = require("./settings"); // settings.json
const firstName = process.argv.slice(2)[0];
const lastName = process.argv.slice(2)[1];
const birthdate = process.argv.slice(2)[2];

var knex = require('knex')({
  client: 'pg',
  connection: {
    user     : settings.user,
    password : settings.password,
    database : settings.database,
    host     : settings.hostname,
    port     : settings.port,
    ssl      : settings.ssl
  }
});

knex('famous_people').insert({first_name: `${firstName}`, last_name: `${lastName}`, birthdate: `${birthdate}`})
    .then(() => {
        console.log(`${firstName} ${lastName} successfully inserted into the database.`);
    })
    .finally(function() {knex.destroy();});