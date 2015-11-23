/**
 * Created by foxye on 15-11-9.
 */

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var agents = {};
var agentSockets = {};

var log4js = require('log4js');
log4js.configure({
    appenders: [
        {
            type: 'file',
            filename: '/home/wwwlogs/ccaction.log',
            maxLogSize: 4096,
            backups:4
        }
    ],
    replaceConsole: true
});

//var logDebug = log4js.getLogger('logDebug');
var logInfo = log4js.getLogger('logInfo');
//var logWarn = log4js.getLogger('logWarn');
//var logErr = log4js.getLogger('logErr');

app.get('/', function(req, res){
    res.sendFile(__dirname + '/client.html');
});

app.get('/popupOnCall', function(req, res){
    var agent = req.query.src;
    io.emit('popupOnCall'+agent, req.query);
    res.send('popupOnCall!!');
});

app.get('/changeExtenStatus', function(req, res){
    var agent = req.query.src;
    io.emit('changeExtenStatus'+agent, req.query);
    res.send('changeExtenStatus!!');
});

app.get('/cdr', function(req, res){
    logInfo.info('cdr: ' + JSON.stringify(req.query));
    res.send('cdr success!!');
});

function cc(action, params){
    logInfo.info('action: '+ action + ' params:'+ JSON.stringify(params));
}

io.on('connection', function(socket){
    socket.on('login', function(data){
        agents[data] = data;
        agentSockets[data] = socket;
        logInfo.info('agents: ' + JSON.stringify(agents));
        //logInfo.info('agentSockets: ' + JSON.stringify(agentSockets));
    });

    socket.on('send msg', function(data){
        agents[data] = data;
        agentSockets[data] = socket;
        logInfo.info('agents: ' + JSON.stringify(agents));
        //logInfo.info('agentSockets: ' + JSON.stringify(agentSockets));
    });

    logInfo.info('connection query:');
    socket.on('disconnect', function(){
        logInfo.info('disconnect query:');
    });
});

http.listen(3000, function(){
    console.log('listening on *:3000');
});