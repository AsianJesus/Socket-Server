/**
 * Created by fruit on 11/10/2018.
 */
var fs = require('fs')
var config = JSON.parse(fs.readFileSync('config.json', 'utf-8'))
var redisConfig = config.redis
var socketioConfig = config.socketIO
var Redis = require('ioredis')
var redis = new Redis(redisConfig)
var http = require('http').createServer((response, request) => {
    console.log('Something has happend', response, request)
})

var io = require('socket.io')(http)

io.on('connection', function (socket) {
    console.log('New connection')
})

io.on("disconnect", function (socket) {
    console.log("Some connection closed")
})

http.listen(socketioConfig.port || '6001', socketioConfig.host || 'localhost')

redis.psubscribe('*', function () {
    console.log('Subscribed');
})
redis.on('pmessage', function (subscribed, channel, data) {
    console.log('New message', subscribed, channel, data)
    io.emit(channel, data)
})
