'use strict';
module.exports = (sequelize, DataTypes) => {
  var Mensaje = sequelize.define('Mensaje', {
    contenido: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Mensaje;
};