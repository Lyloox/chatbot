// @flow
'use strict';
var https = require('https');
var request = require('request');

var str = 'Welcome in ChatBot!';
console.log(str);

let Wit = null;
let interactive = null;
try {
  // if running from repo
  Wit = require('../').Wit;
  interactive = require('../').interactive;
} catch (e) {
  Wit = require('node-wit').Wit;
  interactive = require('node-wit').interactive;
}

const accessToken = (() => {
  if (process.argv.length !== 4) {
    console.log('usage: node examples/quickstart.js <wit-access-token> <forecast-access-token');
    process.exit(1);
  }
  return process.argv[2];
})();

const forecastToken = (() => {
  if (process.argv.length !== 4) {
    console.log('usage: node examples/quickstart.js <wit-access-token> <forecast-access-token');
    process.exit(1);
  }
  return process.argv[3];
})();

// Quickstart example
// See https://wit.ai/ar7hur/quickstart

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value
    ;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

const actions = {
  send (request, response) {
    const {sessionId, context, entities} = request;
    const {text, quickreplies} = response;
    return new Promise(function (resolve, reject) {
      console.log('sending...', JSON.stringify(response));
      return resolve();
    });
  },
  getForecast ({context, entities}) {
    return new Promise(function (resolve, reject) {
      var location = firstEntityValue(entities, 'location');
      if (location) {

        var gmap = "http://maps.google.com/maps/api/geocode/json?address=" + location + "&sensor=false";
        request(gmap, (error, resp, body) => {
          if (error) { 
            reject(error);
          }
          body = JSON.parse(body);
          if (!error && resp.statusCode === 200) {
            var lati = body.results[0].geometry.location.lat;
            var lng  = body.results[0].geometry.location.lng;
            var forecastio = 'https://api.forecast.io/forecast/' + forecastToken + "/" + lati + "," + lng;

            request(forecastio, (error, resp, body) => {
              if (error) { 
                reject(error);
              }

              body = JSON.parse(body);
              if (!error && resp.statusCode === 200) {
                var summary = body.currently.summary;
                var temperature = JSON.stringify(body.currently.temperature);
                context.forecast = summary + ' in ' + location +
              ' with a temperature of ' + temperature + ' Farenheit';
              }
            });
          }
        });

        delete context.missingLocation;

      } else {
        context.missingLocation = true;
        delete context.forecast;
      }
      return resolve(context);
    }).catch((error) => {
      console.log(error);
    });
  }
};

const client = new Wit({accessToken, actions});
interactive(client);
