console.log('Searching...');

const settings = require("./settings"); // settings.json
const personToLookup = process.argv.slice(2);

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
// var pg = require('knex')({client: 'pg'});

function getPersonInfoString(rows) {
  let numOfResults = rows.rowCount;
  let stringToDisplay = ``;

  stringToDisplay += `Found ${numOfResults} person(s) by the name '${personToLookup}'\n`;

  rows.forEach((row, index) => {
    let name = row.person_found;
    let lastName = row.last_name;
    let birthdate = row.birthdate.toISOString().split('T')[0];
    stringToDisplay += `- ${index + 1}: ${name} ${lastName}, born '${birthdate}'`;
    if (index != rows.length - 1) {
      stringToDisplay += `\n`;
    }
  });
  return stringToDisplay;
}

knex.select('first_name as name', 'last_name', 'birthdate')
    .from('famous_people')
    .where('first_name', `${personToLookup}`)
    .then(rows => {
        let stringToDisplay = getPersonInfoString(rows);
        console.log(stringToDisplay);
    })
    .finally(function() {knex.destroy();});