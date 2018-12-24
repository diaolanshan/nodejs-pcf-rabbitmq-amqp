A nodejs application which target to demo how to use amqp(v0.9) protocol to connect to an rabbitmq which hosted in the cloudfoundry platform.

There are number of options for Node.js developers for AMQP client libraries, eg:
- amqplib
- amqp-coffee
- wascally

and we don't recommend node-amqp as client library as it is a unmaintained project and lacks some basic features and has serious bugs.

If you want to use other libraries, and no clue how to proceed, take a look at [here](https://www.cloudamqp.com/docs/nodejs.html).

For this application I select amqplib and the full dependency is:
```json
"dependencies": {
    "restify": "7.2.2",
    "amqplib": "^0.3.2",
    "bluebird": "^3.5.0",
    "cfenv": "1.1.0"
}
```

The application contains two urls:
- {base_url}/amqp/rabbitmq/message/pub will publish a message to the rabbitmq broker, the queue name is __jobs__
- {base_url}/amqp/rabbitmq/message/pub will subscribe to the queue __jobs__

The following code snippet show how to publish a message:
```javascript
function publish(exchange, routingKey, content) {
  try {
    pubChannel.publish(exchange, routingKey, content, { persistent: true },
                      function(err, ok) {
                        if (err) {
                          console.error("[AMQP] publish", err);
                          offlinePubQueue.push([exchange, routingKey, content]);
                          pubChannel.connection.close();
                        }
                      });
  } catch (e) {
    console.error("[AMQP] publish", e.message);
    offlinePubQueue.push([exchange, routingKey, content]);
  }
}
```

The following code snippet show how to consume messages:
```javascript
function startWorker() {
  amqpConn.createChannel(function(err, ch) {
    if (closeOnErr(err)) return;
    ch.on("error", function(err) {
      console.error("[AMQP] channel error", err.message);
    });

    ch.on("close", function() {
      console.log("[AMQP] channel closed");
    });

    ch.prefetch(10);
    ch.assertQueue("jobs", { durable: true }, function(err, _ok) {
      if (closeOnErr(err)) return;
      ch.consume("jobs", processMsg, { noAck: false });
      console.log("Worker is started");
    });

    function processMsg(msg) {
      work(msg, function(ok) {
        try {
          if (ok)
            ch.ack(msg);
          else
            ch.reject(msg, true);
        } catch (e) {
          closeOnErr(e);
        }
      });
    }
  });
}

function work(msg, cb) {
  console.log("Got msg ", msg.content.toString());
  cb(true);
}
```



The full code example can be found in [github](https://github.com/diaolanshan/nodejs-pcf-rabbitmq-amqp).