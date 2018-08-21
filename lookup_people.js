console.log('Searching...');

const pg = require("pg");
const settings = require("./settings"); // settings.json
const personToLookup = process.argv.slice(2);

const client = new pg.Client({
  user     : settings.user,
  password : settings.password,
  database : settings.database,
  host     : settings.hostname,
  port     : settings.port,
  ssl      : settings.ssl
});

function getPersonInfoString(result) {
  let numOfResults = result.rowCount;
  let stringToDisplay = ``;

  stringToDisplay += `Found ${numOfResults} person(s) by the name '${personToLookup}'\n`;

  result.rows.forEach((row, index) => {
    let name = row.person_found;
    let lastName = row.last_name;
    let birthdate = row.birthdate.toISOString().split('T')[0];
    stringToDisplay += `- ${index + 1}: ${name} ${lastName}, born '${birthdate}'`;
    if (index != result.rows.length - 1) {
      stringToDisplay += `\n`;
    }
  });
  return stringToDisplay;
}

client.connect((err) => {
  if (err) {
    return console.error("Connection Error", err);
  }

  let sql = `SELECT DISTINCT first_name AS person_found, last_name, birthdate
            FROM famous_people 
            WHERE first_name = '${personToLookup}'`;

  client.query(sql, (err, result) => {
    if (err) {
      return console.error("error running query", err);
    }

    let stringToDisplay = getPersonInfoString(result);
    console.log(stringToDisplay);

    client.end();
  });
});