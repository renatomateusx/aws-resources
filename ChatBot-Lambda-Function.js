const AWS = require('aws-sdk');
AWS.config.update({
    region: "us-east-1"
});
const docClient = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-1'
});
var table = "myChatBotResponse";
var r = "";
var response = "";
exports.handler = (event, context, callback) => {
    console.log(JSON.stringify(event));
    var intent = event.currentIntent.name;
    if (intent == "welcome") {
        //callback(null,"start");
        var param = {
            TableName: table,
            Key: {
                "Intent": intent
            }
        };
        docClient.get(param, function(err, data) {
            if (err) {
                console.log(err);
            } else {
                r = Math.floor((Math.random() * 2)); //random number generation
                response = {
                    "dialogAction": {
                        "type": "Close",
                        "fulfillmentState": "Fulfilled",
                        "message": {
                            "contentType": "PlainText",
                            "content": data.Item.Message[r]
                        }
                    }
                };
                callback(null, response);
            }
        });
    }
};
