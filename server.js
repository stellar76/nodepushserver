'use strict';

let express = require('express'),
    app = express(),
    request = require("request"),
    url = 'api to watch',
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    appPort = 8080,
    cur_id = '', // initial id when server is started 
    new_id = ''; // id after first api check has been made

let firstCheck = () => {
    console.log(new Date);
    request({
        url: url,
        json: true
    }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            cur_id = body.items[0].id
            console.log(cur_id)
        }
    })
}

let checkAlerts = () => {
    request({
        url: url,
        json: true
    }, (error, response, body) => {
        if (!error && response.statusCode === 200) {
            new_id = body.items[0].id
            if (new_id != cur_id) {
                console.log('new alert found: ' + body.items[0].title)

            } else {
                io.emit('sendalert', {
                  title : body.items[0].title,
                  url: body.items[0].link,
                });
            }
        }
    })
}

setInterval(checkAlerts, 10 * 1000);

app.get('/', (req, res, next) => {
    //res.send('PUSH SERVER IS ONLINE.')
    res.json(alerts)
});


app.listen('3030', () => {
    console.log('::: push server is ready :::');
    firstCheck();
});

server.listen(appPort);
console.log('::: socket server waiting on clients :::');
