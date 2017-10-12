$(document).ready(function() { 	
    $('#input_horaactual').bootstrapMaterialDatePicker({ 
        date: false,
        shortTime: false,
        format: 'HH:mm',        
        'cancelText' : 'Cancelar',
        'okText' : 'Aceptar'        
    });
    $('#input_horaalarma').bootstrapMaterialDatePicker({ 
        date: false,
        shortTime: false,
        format: 'HH:mm', 
        'cancelText' : 'Cancelar',
        'okText' : 'Aceptar'  
    });
    $('#input_horaactual').bootstrapMaterialDatePicker().on('change', function(e, date){
        
        });
});