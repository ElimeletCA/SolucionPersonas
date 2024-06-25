$.alert({
    title: 'Verificación de correo electrónico',
    content: '<center><br/><div class="text-center"><br/><div class="text-center"><i class="fa-solid fa-circle-check fa-beat fa-6x" style="color: #04ff00;"></i><br/><br/><strong>Su correo fue verificado exitosamente, gracias por su registro</strong></div></center>',
    autoClose: 'tryAgain|5000',
    type: 'green',
    typeAnimated: true,
    buttons: {
        tryAgain: {
            text: 'Aceptar',
            btnClass: 'btn-success',
            action: function () {
                window.location.href = '/Auth/Login';
            }
        }
    }
});