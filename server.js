const express = require('express');
const app = express();
const http = require('http').Server(app);
const Sequelize = require('sequelize');
var models  = require('./models');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    models.Mensaje.findAll({ limit: 10 }).then(function(mensajes) {
        res.render('index', {
          title: 'Pet Center',
          mensajes: mensajes
        })
    res.sendFile(__dirname+'/public/index.html');
  })
});

http.listen(8090, function(){
    console.log('server http en 8090');
});