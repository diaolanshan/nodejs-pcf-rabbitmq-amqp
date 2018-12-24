const  restify = require('restify');

// local enviroment or cloud environment
const  port = process.env.VCAP_APP_PORT || 3000
const  ip_address = process.env.VCAP_APP_HOST || 'localhost'


var server = restify.createServer({
    name : "nodejs-pcf-rabbitmq-amqp"
});
 
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
// server.use(restify.plugins.CORS());

const PUB_PATH = '/amqp/rabbitmq/message/pub'
const SUB_PATH = '/amqp/rabbitmq/message/sub'

server.get({path : PUB_PATH , version: '0.0.1'}, pub_message);
server.get({path : SUB_PATH , version: '0.0.1'}, sub_message);

var client = require('./client.js')
client.start();

// Publish a message to the rabbitmq broker
function pub_message(req, res, next){
	client.publish("", "jobs", new Buffer("work work work..."));
	res.send(200 , 'Message published to rabbitmq.');
	return next();
}

// Start to subscribe to the queue.
function sub_message(req, res, next){
	client.startWorker();
	res.send(200 , 'Subscribe to queue successfully.');
	return next();
}

server.listen(port ,ip_address, function(){
    console.log('%s listening at %s ', server.name , server.url);
});
