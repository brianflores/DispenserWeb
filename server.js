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
                conf: conf[0]
            })
        })
    })

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
                    var msj = undefined;
                    if(conf.hora_actual != '' && conf.hora_alarma != ''){
                        msj = '|A|'+conf.hora_actual+'|'+conf.hora_alarma+'|'+conf.racion+'|||\r\n';
                    } else if(conf.hora_actual == '' && conf.hora_alarma == '') {
                        msj = '|D|'+conf.racion+'|||\r\n';
                    } else if(conf.hora_actual == ''){
                        msj = '|C|'+conf.hora_alarma+'|'+conf.racion+'|||\r\n';
                    } else {
                        msj = '|B|'+conf.hora_actual+'|'+conf.racion+'|||\r\n';
                    }
                    tcpGuests[g].write(msj);
                }
            }

        )
    });
    models.Mensaje.findAll({limit: 5, order: [['updatedAt', 'DESC']]}).then(function(mensajes) {
                models.Conf.findAll({limit:1,order: [['updatedAt', 'DESC']] }).then(function(conf) {
                res.render('index', {
                title: 'Pet Center',
                mensajes: mensajes,
                conf: conf[0]
                })
            })
    })
}
var server = net.createServer(function(socket) {
    socket.setEncoding('utf8');
    tcpGuests.push(socket);
    socket.on('data',function(data){
        //La CIAA envia un mensaje y el servidor lo guarda para mostrarlo en la tabla de eventos.
        //console.log(data);
        if (data.slice(0, 7) == "getData"){
            models.Conf.findAll({limit:1,order: [['updatedAt', 'DESC']] }).then(function(conf) {
                         var config = conf[0];
                         for (g in tcpGuests){
                            var msj = undefined;
                            if(config.hora_alarma == ''){
                                msj='|D|'+config.racion+'|||\r\n';
                              }
                              else {
                                msj='|C|'+config.hora_alarma+'|'+config.racion+'|||\r\n';
                              }
                            tcpGuests[g].write(msj);
                        }
                 });
            models.Mensaje.create({contenido: "Se conecto el dispenser"}).then(
            msj =>{
                console.log(msj.get({plain: true}))
            })    
        } else{
            models.Mensaje.create({contenido: data.slice(0, -1)}).then(
                msj =>{
                    console.log(msj.get({plain: true}))
                })  
        }
    });
    socket.on("error", function(err) {
    console.log("Caught flash policy server socket error: ");
    console.log(err.stack)
    });
}).listen(1337, '192.168.0.205');
http.listen(process.env.PORT ||8090, function(){
    console.log('server http en 8090');
});
