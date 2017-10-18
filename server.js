const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Sequelize = require('sequelize');
var formidable = require("formidable"),
    util = require('util');
var models  = require('./models');
var net = require('net');

var tcpGuests = [];
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
            
    models.Mensaje.findAll({limit: 5, order: [['updatedAt', 'DESC']]}).then(function(mensajes) {
        models.Conf.findAll({limit:1,order: [['updatedAt', 'DESC']] }).then(function(conf) {
            res.render('index', {
                title: 'Pet Center',
                mensajes: mensajes,
                conf: conf
            })
        })
    })
            //res.sendFile(__dirname+'/public/index.html');
        
});
app.post('/',(req,res) => {
    procesarForm(req,res);
}); 
function procesarForm(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        models.Conf.create({hora_alarma: fields.input_horaalarma, hora_actual: fields.input_horaactual, racion: fields.selector }).then (
            conf => {
                console.log(conf.get({plain: true}))
                models.Mensaje.create({contenido: "Configuración actualizada"}).then(
                    msj =>{
                        console.log(msj.get({plain: true}))
                    }
                )
                //Transmitir los cambios de configuracion a la CIAA
                for (g in tcpGuests){
                    tcpGuests[g].write(conf.racion + ' | ' + conf.hora_actual +' | '+ conf.hora_alarma);
                }  
            }
            
        )
    });
    models.Mensaje.findAll({limit: 5, order: [['updatedAt', 'DESC']]}).then(function(mensajes) {
                models.Conf.findAll({limit:1,order: [['updatedAt', 'DESC']] }).then(function(conf) {
                res.render('index', {
                title: 'Pet Center',
                mensajes: mensajes,
                conf: conf
                })
            })
    })
}
var server = net.createServer(function(socket) {
    socket.setEncoding('utf8');
    tcpGuests.push(socket);
    //Cuando la CIAA se conecta al servidor TCP, se le envía la última configuración, para chequear si hubo cambios.
    models.Conf.findAll({limit:1,order: [['updatedAt', 'DESC']] }).then(function(conf) {
            var config = conf[0];
            socket.write(config.racion + ' | ' + config.hora_alarma + ' | ' + config.hora_actual);
	        socket.pipe(socket);
        });
    socket.on('data',function(data){
        //La CIAA envia un mensaje y el servidor lo guarda para mostrarlo en la tabla de eventos.
        console.log(data);
        models.Mensaje.create({contenido: data}).then(
            msj =>{
                console.log(msj.get({plain: true}))
            }
        )
        socket.write('dijiste '+data);
    });
}).listen(1337, '127.0.0.1'); 
http.listen(8090, function(){
    console.log('server http en 8090');
});