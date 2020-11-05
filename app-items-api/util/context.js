/**
 * @author Jorge Iglesias/Spain/IBM@ES
 * @description
 * <p>
 * Constant variables.
 * </p>
 */
 
var pjson = require('../package.json');

var context = {

  // App
  APP_NAME : pjson.name,
  APP_VERSION : pjson.version,

  // Status codes
  RESPONSE_STATUS_CODE_OK : 200,
  RESPONSE_STATUS_CODE_UNAUTHORIZED : 401,
  RESPONSE_STATUS_CODE_REQUEST_TIME_OUT : 408,
  RESPONSE_STATUS_CODE_SERVICE_UNAVAILABLE : 503,

};

module.exports = context;
