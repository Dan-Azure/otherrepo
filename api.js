// Main server and wrapper.
const hapi       = require('hapi');
const Joi        = require('joi');
const await      = require('await');
const https      = require('https');


var keepAlive = new https.Agent({keepAlive: true});

function request(options, callback){
	var opts = {
	    method: options.method || 'GET',
		host:   options.host,
		port:   443,
	    path:   options.path,
        agent:  keepAlive,
	    headers: {
	        'Authorization': 'none',
	        'Content-Type': 'application/json'
        }
	};
	var rqst = https.request(opts, (rspn)=>{
	    var chunks = [];
        rspn.on('data',  (d) => chunks.push(d));
        rspn.on('error', (e) => { log.debug(opts.host, opts.port, opts.path, options.auth, e); callback(e);});
        rspn.on('end', 	 ()  => {
            if(rspn.statusCode == 200) callback(null, Buffer.concat(chunks));
            else {
                var msg = Buffer.concat(chunks).toString();
                log.debug(msg, opts. method, opts.host, opts.port, opts.path, options.auth);
                callback(new Error(msg));
            }
        });
    });
    rqst.setTimeout(options.timeout || 5000, function(){ callback(new Error(TIMED_OUT));});
    rqst.on('error', (e) => callback(e));
    if(options.payload) rqst.write(JSON.stringify(options.payload));
    rqst.end();
}



let getTemperature = (city) => {
  var options = {
      host:   "api.openweather.org",
      path:   "/data/2.5/weather?q=" + city
  };

  request(options, function(err, rspn){

      if(err) {
          console.log(err);
          return "0";
      }
      else {
        return((rspn.main.temp)-273);
      }
  });

}

let getTime = (city) => {
  var options = {
      host:   "somewhere",

      path:   "somepath",
      agent:	keepAlive
  };

  request(options, function(err, rspn){

      if(err) {
          console.log(err);
          return ("00:00");
      }
      else {
        var localDate = new Date((timestamp + dstOffset + rawOffset) * 1000);
        return(rspn.data);
      }
  });

}

async function getCityInformation (rqst, reply) {

  // Steal the information from somewhere
  const temperature = await getTemperature(city);

//  const localTime = await getTime(city);

  // Return it to the user
  let result = {"weather": {"temperature": temperature},
                "time": {"localTime": localtime}};

  reply(result);

}

const server = new hapi.Server({ port: 3000, host: 'localhost' });

console.log(getTemperature("Munich"));


server.route({
    method: 'GET',
    path: '/getCityInformation/{city}',
    handler: getCityInformation,
    config: {
      description: 'Should return weather and local time',
      notes: 'Should return weather and local time',
      tags: ['main api'],
      validate: {
        params: {
          city: Joi.string().description("Name of the city")
        }
      }
    }
});

server.start(() => {
  console.log("Server is running");
});

module.exports = {
    getTime,
    getTemperature
}
