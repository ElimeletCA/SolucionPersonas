const cargandomodal = {
    imageUrl: "/resources/images/loading.gif",
    imageWidth: 100,
    imageHeight: 100,
    imageAlt: "Custom image",
    width: '200px',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showConfirmButton: false,
    backdrop: true
};

function cerrarSesion() {
    $.confirm({
        title: 'Esta seguro que desea cerrar sesión?',
        content: '<br/><div class="text-center"><i class="fa-solid fa-circle-question fa-bounce fa-6x" style="color: #009dff;"></i></div><br/>',
        buttons: {
            confirmar: {
                text: 'Confirmar',
                btnClass: 'btn-green',
                keys: ['enter', 'shift'],
                action: function () {

                    $.ajax({
                        url: '/Auth/CerrarSesion',
                        type: 'POST',
                        success: function (response) {
                            if (response.success) {
                                window.location.href = '/Auth/Login';
                            }
                        }
                    });
                }
            },
            cancelar: {
                text: 'Cancelar',
                btnClass: 'btn-dark',
                keys: ['enter', 'shift'],
                action: function () {
                }
            }
        }
    });

}

