$(function () {

    const passwordInput = document.getElementById('txtpassword');
    document.getElementById('btnpassword').addEventListener('click', function () {
        const toggleIcon = document.getElementById('btnpassword');

        // Toggle the type attribute
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);

        // Toggle the eye icon
        if (type === 'password') {
            toggleIcon.classList.remove('fa-eye-slash');
            toggleIcon.classList.add('fa-eye');
        } else {
            toggleIcon.classList.remove('fa-eye');
            toggleIcon.classList.add('fa-eye-slash');
        }
    });
    $('#formlogin').validate({
        rules: {
            txtusuarioemail: {
                required: true,
            },
            txtpassword: {
                required: true
            }
        },
        messages: {
            txtusuarioemail: {
                required: "Por favor, introduzca un usuario o correo electrónico."
            },
            txtpassword: {
                required: "Por favor, introduzca una contraseña."
            }
        },
        errorPlacement: function (error, element) {
            error.addClass('text-danger fw-bolder');
            if (element.attr('id') === 'txtpassword') {
                error.insertAfter($('#passwordgroup'));
            } else {
                error.insertAfter(element);
            }
        },
        highlight: function (element) {
            $(element).addClass('border border-3 border-danger');
        },
        unhighlight: function (element) {
            $(element).removeClass('border border-3 border-danger');
        },
        success: function (label) {
            label.remove();
        }, submitHandler: function (form) {
            loguearusuario();
            return false;
        }

    });

});
function loguearusuario() {
    Swal.fire(cargandomodal);
    //Agregar nueva cuenta
    var usuario = new Object();
    usuario.UserName = $('#txtusuarioemail').val();
    usuario.PasswordWithoutHash = $('#txtpassword').val();

    $.ajax({
        url: '/Auth/LoginUsuario',
        type: 'POST',
        data: usuario,
        success: function (response) {

            if ((response.success === false) && (response.message === 'ERROR')) {
                $.alert({
                    title: 'Error al iniciar sesión',
                    content: '<center><br/><div class="text-center"><br/><div class="text-center"><i class="fa-solid fa-circle-exclamation fa-shake fa-6x" style="color: #ff0000;"></i><br/><strong>Hubo un error desconocido al iniciar sesión, contacte al soporte técnico</strong></div></center>',
                    autoClose: 'tryAgain|3000',
                    type: 'red',
                    typeAnimated: true,
                    buttons: {
                        tryAgain: {
                            text: 'Aceptar',
                            btnClass: 'btn-danger',
                            action: function () {
                            }
                        }
                    }
                });
                Swal.close(cargandomodal);
            }

            else if (response.success === false) {

                $.alert({
                    title: 'Verifique los datos',
                    content: '<center><br/><div class="text-center"><br/><div class="text-center"><i class="fa-solid fa-triangle-exclamation fa-beat-fade fa-6x" style="color: #FFD43B;"></i><br/><strong>' + response.message + '</strong ></div ></center > ',
                    autoClose: 'tryAgain|3000',

                    type: 'orange',
                    typeAnimated: true,
                    buttons: {
                        tryAgain: {
                            text: 'Intentar de nuevo',
                            btnClass: 'btn-warning',
                            action: function () {
                            }
                        }
                    }
                });
                Swal.close(cargandomodal);

            }
            else if ((response.success === true) && (response.message === '2FA')) {
                $.alert({
                    title: 'Autenticación de dos factores (2FA)',
                    content: '' +
                        '<form action="" class="formName">' +
                        '<div class="form-group">' +
                        '<label>Se ha enviado un código de autenticación de dos factores (2FA) a su correo electrónico registrado. Por favor, revise su bandeja de entrada y utilice el código proporcionado para completar su inicio de sesión.</label>' +
                        '<br/><br/><input id="txt2fa" type="text" placeholder="Código de verificación" class="code2fa form-control" required />' +
                        '</div>' +
                        '</form>',
                    type: 'green',
                    typeAnimated: true,
                    buttons: {
                        formSubmit: {
                            text: 'Verificar',
                            btnClass: 'btn-blue',
                            action: function () {
                                var value = $('#txt2fa').val();
                                if (/^\d{6}$/.test(value)) {
                                    usuario.TwoFactorCode = value;
                                    $.ajax({
                                        url: '/Auth/Verificar2FA',
                                        type: 'POST',
                                        data: usuario,
                                        success: function (response) {
                                            if ((response.success === true) && (response.message === 'VERIFICADO')) {
                                                $.alert({
                                                    title: 'Verificación exitosa',
                                                    content: '<center><br/><div class="text-center"><br/><div class="text-center"><i class="fa-solid fa-circle-check fa-beat fa-6x" style="color: #04ff00;"></i><br/><br/><strong>Será redirigido al sistema en unos segundos</strong></div></center>',
                                                    autoClose: 'tryAgain|3000',
                                                    type: 'green',
                                                    typeAnimated: true,
                                                    buttons: {
                                                        tryAgain: {
                                                            text: 'Aceptar',
                                                            btnClass: 'btn-success',
                                                            action: function () {
                                                                window.location.href = '/Inicio/Index';
                                                            }
                                                        }
                                                    }
                                                });
                                            } else {
                                                $.alert({
                                                    title: 'Verifique el código digitado',
                                                    content: '<center><br/><div class="text-center"><br/><div class="text-center"><i class="fa-solid fa-triangle-exclamation fa-beat-fade fa-6x" style="color: #FFD43B;"></i></div ></center > ',
                                                    autoClose: 'tryAgain|3000',

                                                    type: 'orange',
                                                    typeAnimated: true,
                                                    buttons: {
                                                        tryAgain: {
                                                            text: 'Intentar de nuevo',
                                                            btnClass: 'btn-warning',
                                                            action: function () {
                                                            }
                                                        }
                                                    }
                                                });
                                            }
                                        }

                                    });
                                    return false
                                } else {
                                    $.alert('El campo debe contener exactamente 6 dígitos');
                                    return false
                                }
                            }
                        }
                    },
                    onContentReady: function () {

                        // bind to events
                        var jc = this;
                        this.$content.find('form').on('submit', function (e) {
                            // if the user submits the form by pressing enter in the field.
                            e.preventDefault();
                            jc.$$formSubmit.trigger('click'); // reference the button and click it
                        });
                        $('#txt2fa').inputmask("999999");


                    }
                });

                Swal.close(cargandomodal);

            }
        }
    });
}