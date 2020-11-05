/**
 * @author Jorge Iglesias/Spain/IBM@ES
 * @description
 * <p>
 * Test MySQL Databases
 * </p>
 */

// Load modules
const mysql = require('mysql');

// Create connection
const con = mysql.createConnection({
  host: 'localhost',
  port: '13306',
  user: 'user1',
  password: 'user1',
  database: 'items',
});

con.connect((err) => {
  if(err){
    console.log('Error connecting to Db');
    console.log(err);
    process.exit(1);
  }
  console.log('Connection established');

  con.query('select * from Hardware', (err,rows) => {
    if(err) {
      console.log('Query Error');
      console.log(err);
      process.exit(1);
    }      

    console.log('Data received from Db:');
    console.log(rows);
      
    rows.forEach( (row) => {
      console.log(`${row.name} has the code ${row.code}`);
    });

    con.end((err) => {
      // The connection is terminated gracefully
      // Ensures all remaining queries are executed
      // Then sends a quit packet to the MySQL server.
    });

  });

});
