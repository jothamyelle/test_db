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

client.connect((err) => {
  if (err) {
    return console.error("Connection Error", err);
  }
  client.query(`SELECT DISTINCT first_name AS person_found,  last_name, birthdate
                FROM famous_people 
                WHERE first_name = '${personToLookup}'`, (err, result) => {
    if (err) {
      return console.error("error running query", err);
    }
    let numOfResults = result.rowCount;
    
    console.log(`Found ${numOfResults} person(s) by the name '${personToLookup}'`);
    for (let i = 0; i < numOfResults; i++) {
      let name = result.rows[i].person_found;
      let lastName = result.rows[i].last_name;
      let birthdate = result.rows[i].birthdate.toISOString().split('T')[0];
      console.log(`- ${i + 1}: ${name} ${lastName}, born '${birthdate}'`);
    }
    client.end();
  });
});