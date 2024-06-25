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
    var passwordMessageItems = document.getElementsByClassName("password-message-item");
    var passwordMessage = document.getElementById("password-message");
    var imageleft = document.getElementById("imageleft");
    passwordInput.onfocus = function () {
        passwordMessage.style.display = "block";
    }
    // After clicking outside of password input hide the message 
    passwordInput.onblur = function () {
        passwordMessage.style.display = "none";
    }

    passwordInput.onkeyup = function () {
        // checking lowercase letters 
        let lowercaseRegex = /[a-z]/g;
        if (passwordInput.value.match(lowercaseRegex)) {
            passwordMessageItems[0].classList.remove("invalid");
            passwordMessageItems[0].classList.add("valid");
        } else {
            passwordMessageItems[0].classList.remove("valid");
            passwordMessageItems[0].classList.add("invalid");
        }
        // checking uppercase letters 
        let uppercaseRegex = /[A-Z]/g;
        if (passwordInput.value.match(uppercaseRegex)) {
            passwordMessageItems[1].classList.remove("invalid");
            passwordMessageItems[1].classList.add("valid");
        } else {
            passwordMessageItems[1].classList.remove("valid");
            passwordMessageItems[1].classList.add("invalid");
        }
        // checking the number 
        let numbersRegex = /[0-9]/g;
        if (passwordInput.value.match(numbersRegex)) {
            passwordMessageItems[2].classList.remove("invalid");
            passwordMessageItems[2].classList.add("valid");
        } else {
            passwordMessageItems[2].classList.remove("valid");
            passwordMessageItems[2].classList.add("invalid");
        }

        // checking special characters
        let specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/g;
        if (passwordInput.value.match(specialCharRegex)) {
            passwordMessageItems[3].classList.remove("invalid");
            passwordMessageItems[3].classList.add("valid");
        } else {
            passwordMessageItems[3].classList.remove("valid");
            passwordMessageItems[3].classList.add("invalid");
        }
        // Checking length of the password 
        if (passwordInput.value.length >= 8) {
            passwordMessageItems[4].classList.remove("invalid");
            passwordMessageItems[4].classList.add("valid");
        } else {
            passwordMessageItems[4].classList.remove("valid");
            passwordMessageItems[4].classList.add("invalid");
        }
    }
    $('head').append('<style>.error-text { display: none; }</style>');
    $('#formregistro').on('keypress', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
        }
    });
    //Restrinciones de los campos
    $('#txtnombreusuario').inputmask({
        mask: '*{1,15}',
        definitions: {
            '*': {
                validator: "[a-zA-Z]",
                cardinality: 1
            }
        }
    });
    $('#txttelefono').inputmask('(999) 999-9999');

    $('#txtnombrecompleto').inputmask({
        mask: '*{1,50}',
        definitions: {
            '*': {
                validator: "[a-zA-ZáéíóúÁÉÍÓÚüÜ ]",
                cardinality: 1
            }
        }
    });
    $('#txtemail').inputmask('email');

    $.validator.addMethod("lettersonly", function (value, element) {
        return this.optional(element) || /^[a-zA-Z\s]+$/.test(value);
    }, "Solo se permiten letras en este campo.");

    //Regla personalizada para validar contraseña
    $.validator.addMethod("validarPassword", function (value, element) {
        // Validar al menos una mayúscula
        let uppercaseRegex = /[A-Z]/g;
        let hasUppercase = value.match(uppercaseRegex);

        // Validar al menos una minúscula
        let lowercaseRegex = /[a-z]/g;
        let hasLowercase = value.match(lowercaseRegex);

        // Validar al menos un número
        let numbersRegex = /[0-9]/g;
        let hasNumber = value.match(numbersRegex);

        // Validar al menos un caracter especial
        let specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/g;
        let hasSpecialChar = value.match(specialCharRegex);

        // Validar longitud mínima
        let isValidLength = value.length >= 8;

        // Todos los criterios deben cumplirse
        return hasUppercase && hasLowercase && hasNumber && hasSpecialChar && isValidLength;
    }, "Por favor, introduzca una contraseña valida.");
    $('#formregistro').validate({
        rules: {
            txtnombreusuario: {
                required: true,
                lettersonly: true
            },
            txtpassword: {
                required: true,
                validarPassword: true
            },
            txtnombrecompleto: {
                required: true

            },
            dpfechanacimiento: {
                required: true
            },
            txttelefono: {
                required: true
            },
            txtemail: {
                required: true
            }
        },
        messages: {
            txtnombreusuario: {
                required: "Por favor, introduzca un nombre de usuario."
            },
            txtpassword: {
                required: "Por favor, introduzca una contraseña valida."
            },
            txtnombrecompleto: {
                required: "Por favor, introduzca el nombre completo."
            },
            dpfechanacimiento: {
                required: "Por favor, introduzca la fecha de nacimiento."
            },
            txttelefono: {
                required: "Por favor, introduzca el número de teléfono."
            },
            txtemail: {
                required: "Por favor, introduzca el correo electrónico."
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
            registrarUsuario();
            return false;
        }

    });
});
function registrarUsuario() {
    $.confirm({
        title: 'Esta seguro que quiere registrar esta cuenta?',
        content: '<br/><div class="text-center"><i class="fa-solid fa-floppy-disk fa-bounce fa-6x" style="color: #0091ff;"></i></div><br/>',
        buttons: {
            confirmar: {
                text: 'Confirmar',
                btnClass: 'btn-green',
                keys: ['enter', 'shift'],
                action: function () {

                    Swal.fire(cargandomodal);
                    //Agregar nueva cuenta
                    var usuario = new Object();
                    usuario.UserName = $('#txtnombreusuario').val();
                    usuario.PasswordWithoutHash = $('#txtpassword').val();
                    usuario.FullName = $('#txtnombrecompleto').val();
                    usuario.FullName = $('#txtnombrecompleto').val();
                    usuario.BirthDate = $('#dpfechanacimiento').val();
                    usuario.PhoneNumber = $('#txttelefono').val();
                    usuario.Email = $('#txtemail').val();

                    $.ajax({
                        url: '/Auth/RegistrarUsuario',
                        type: 'POST',
                        data: usuario,
                        success: function (response) {

                            if ((response.success === false) && (response.message === 'ERROR')) {
                                $.alert({
                                    title: 'Error al registrarse',
                                    content: '<center><br/><div class="text-center"><br/><div class="text-center"><i class="fa-solid fa-circle-exclamation fa-shake fa-6x" style="color: #ff0000;"></i><br/><strong>Hubo un error desconocido al registrarse, contacte al soporte técnico</strong></div></center>',
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
                            else if (response.success === true) {
                                $.alert({
                                    title: 'Verificación de correo electrónico',
                                    content: '<center><br/><div class="text-center"><br/><div class="text-center"><i class="fa-solid fa-circle-check fa-beat fa-6x" style="color: #04ff00;"></i><br/><br/><strong>Se ha enviado un enlace de verificación a su correo electrónico. Por favor, revise su bandeja de entrada y verifique su correo para completar la creación de su cuenta.</strong></div></center>',
                                    autoClose: 'tryAgain|3000',
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
                                Swal.close(cargandomodal);

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
