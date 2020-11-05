/**
 * @author Jorge Iglesias/Spain/IBM@ES
 * @description
 * <p>
 * Server
 * </p>
 */

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// body-parser Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
// for more info, see: https://www.npmjs.com/package/body-parser
var bodyParser = require("body-parser");

// Embedded JavaScript templates.
// for more info, see: https://www.npmjs.com/package/ejs
var ejs = require('ejs');

// Load the local config properties
const localConfig = require('./config/local.json');

// create a new express server
var app = express();

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// serve parse the request body
// returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option.
// this parser accepts any Unicode encoding of the body and supports automatic inflation of gzip and deflate encodings.
app.use(bodyParser.json());

// catch json error
app.use(function (error, req, res, next){
  res.status(error.status).send(req);
});

// false use querystring, true use qs library
app.use(bodyParser.urlencoded({ extended: true }));

// set engine for pages in folder viewa
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

// Set global variables
global._appDir = __dirname;
global._isDebug = true;

var routes = require("./routes/main.js")(app);

// start server on the specified port and binding host
const port = process.env.PORT || localConfig.port;

app.listen(port, function(){
  // print a message when the server starts listening
  console.log('server starting on http://localhost:' + port);
});
