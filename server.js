const express = require('express');
const app = express();
const http = require('http').Server(app);
const Sequelize = require('sequelize');
var formidable = require("formidable"),
    util = require('util');
var models  = require('./models');
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
            }
            //ACÁ VA CÓDIGO PARA TRANSMITIR MENSAJE A LA CIAA
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

http.listen(8090, function(){
    console.log('server http en 8090');
});