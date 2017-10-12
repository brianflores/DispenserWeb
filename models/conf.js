'use strict';
module.exports = (sequelize, DataTypes) => {
  var Conf = sequelize.define('Conf', {
    hora_alarma: DataTypes.STRING,
    racion: DataTypes.STRING,
    hora_actual: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Conf;
};