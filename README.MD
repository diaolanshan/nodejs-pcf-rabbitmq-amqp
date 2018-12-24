A nodejs application which target to demo how to use amqp protocol to connect to an rabbitmq which hosted in the cloudfoundry platform.

The application depends on the following library:
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

The full code can be found in [github](https://github.com/diaolanshan/nodejs-pcf-rabbitmq-amqp).