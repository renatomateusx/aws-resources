var https = require('https');
exports.handler = (event, context, callback) => {
    var STATUS = "false";
    var lookItem = event.currentIntent.slots.item;
    var msg = event.currentIntent.slots.target_countries;
    lookItem = lookItem.charAt(0).toUpperCase() + lookItem.slice(1);
    msg = msg.charAt(0).toUpperCase() + msg.slice(1);
    if (msg == "USA" || msg == "America" || msg == "Usa" || msg == "The united states of america" || msg == "U.S.A") {
        msg = "United States of America";
    }
    var url = "https://restcountries.com/v2/name/" + msg;
    var res = https.get(url, function(res) {
        var body = '';
        res.on('data', function(chunk) {
            body += chunk;
        });
        res.on('end', function() {
            var response = JSON.parse(body);
            console.log("Got a response: " + response);
            for (var i = 0; i < response.length; i++) {
                if (response[i]['name'] == msg) {
                    if (lookItem == "Capital") {
                        var result = "The capital of " + msg + " is " + response[i]['capital'];
                        STATUS = "true";
                    } else if (lookItem == "Currency") {
                        var result = "The currency of " + msg + " is " + response[i]['currencies'][0]['name'];
                        STATUS = "true";
                    } else if (lookItem == "Language") {
                        var result = "The language of " + msg + " is " + response[i]['languages'][0]['name'];
                        STATUS = "true";
                    }
                }
            }
            if (STATUS == "false") {
                result = "The " + lookItem + " of " + msg + " not found.!";
            }
            var capital = {
                "dialogAction": {
                    "type": "Close",
                    "fulfillmentState": "Fulfilled",
                    "message": {
                        "contentType": "PlainText",
                        "content": result
                    }
                }
            };
            callback(null, capital);
        });
    });
};