/**
 * @author Jorge Iglesias/Spain/IBM@ES
 * @description
 * <p>
 * Express routes.
 * </p>
 */

// Load modules
var fs = require('fs');
const log4js = require('log4js');
const mysql = require('mysql');

// Load variables context
var CONTEXT = require(global._appDir + '/util/context.js');

var appRouter = function(app) {

  /**
   * Data backend
   */
  app.post("/v1/data", function(req, res) {
    var statusCode = CONTEXT.RESPONSE_STATUS_CODE_OK; // by defaut 200 OK
    var response = {};

    var data = req.body;

    // Create connection
    const con = mysql.createConnection({
      host: process.env.DATABASE_URL,
      port: process.env.DATABASE_PORT,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: 'items',
    });

    con.connect((err) => {
      if(err){
        console.log('Error connecting to Db');
        console.log(err);

        statusCode = CONTEXT.RESPONSE_STATUS_CODE_SERVICE_UNAVAILABLE;
        response.message = 'Error connecting to Db';
        
        res.status(statusCode).json(response);
        res.end(); //End the response process.
      }
      else {
        console.log('Connection established');

        con.query('select * from Hardware', (err,rows) => {
          if(err) {
            console.log('Query Error');
            console.log(err);
            
            statusCode = CONTEXT.RESPONSE_STATUS_CODE_SERVICE_UNAVAILABLE;
            response.message = 'Query Error';
    
            res.status(statusCode).json(response);
            res.end(); //End the response process.
          }      
          else {
            console.log('Data received from Db:');
            console.log(rows);
          
            data.storage = [];
            
            rows.forEach( (row) => {
              console.log(`${row.name} has the code ${row.code}`);
    
              data.storage.push({
                "type": `${row.name}`,
                "size": `${row.code}`
              });
            });
    
            con.end((err) => {
              // The connection is terminated gracefully
              // Ensures all remaining queries are executed
              // Then sends a quit packet to the MySQL server.
    
              response.message = data.storage;
    
              res.status(statusCode).json(response);
              res.end(); //End the response process.
            });
          }  
        });
          
      }
  
    });
    
  });

}

module.exports = appRouter;
