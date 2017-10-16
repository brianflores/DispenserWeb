# DispenserWeb
Servidor web para comunicación con el dispenser de comida realizado para Taller de Proyecto 1 - UNLP

## Instalación:
se debe tener nodeJS, npm y postgresql instalados.

### instalar dependencias:
posicionarse en el directorio del proyecto y ejecutar:
``` sh
$ npm install
``` 
### correr migraciones de la base de datos
``` sh
$ node_modules/.bin/sequelize db:migrate
``` 
## Poner en marcha el servidor:
``` sh
$ node server.js
``` 
